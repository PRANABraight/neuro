# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS  # <-- Import CORS
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
import logging

app = Flask(__name__)
CORS(app, resources={r"/detect": {"origins": "http://localhost:3000"}, r"/health": {"origins": "http://localhost:3000"}})
# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the tuned pipeline (including preprocessing and LightGBM classifier)
model = joblib.load('tuned_model_cicids_lightgbm.pkl')

# (Optional) Load the scaler if you need to apply it separately
scaler = joblib.load('tuned_scaler_cicids.pkl')

# Load the original feature columns used during training
original_feature_columns = joblib.load('original_feature_columns.pkl')

# Define custom thresholds (for example, adjusting the probability for class 3)
CUSTOM_THRESHOLDS = {3: 0.22}

def custom_predict_with_thresholds(probabilities, thresholds):
    """
    Apply custom thresholds for specific classes.
    Default prediction is argmax of probabilities. For each specified class,
    if the predicted probability is at or above its threshold, that class is forced.
    """
    adjusted_preds = np.argmax(probabilities, axis=1)
    for class_label, threshold in thresholds.items():
        high_confidence = probabilities[:, class_label] >= threshold
        adjusted_preds[high_confidence] = class_label
    return adjusted_preds

@app.route('/detect', methods=['POST'])
def detect():
    """
    Expects a JSON payload with:
      - timestamp (ISO format string)
      - source_ip (string)
      - destination_ip (string)
      - protocol (string)
      - features: a list of raw feature values (must match the length of original_feature_columns)
    
    Returns:
      A JSON object with predicted class, severity label, alert flag, and probabilities.
    """
    try:
        data = request.get_json()
        required_keys = ['timestamp', 'source_ip', 'destination_ip', 'protocol', 'features']
        if not all(key in data for key in required_keys):
            return jsonify({"error": "Invalid input format. Missing required keys."}), 400

        # Validate feature length
        features = data['features']
        if len(features) != len(original_feature_columns):
            return jsonify({
                "error": f"Expected {len(original_feature_columns)} features, got {len(features)}."
            }), 400

        # Create a DataFrame from the incoming features (ensure the column names match the training data)
        input_df = pd.DataFrame([features], columns=original_feature_columns)

        # Predict probability distribution
        y_prob = model.predict_proba(input_df)

        # Apply custom threshold calibration
        y_pred = custom_predict_with_thresholds(y_prob, CUSTOM_THRESHOLDS)

        # Define severity mapping (0: Low, 1: Medium, 2: High, 3: Critical)
        severity_mapping = {0: "Low", 1: "Medium", 2: "High", 3: "Critical"}
        severity_label = severity_mapping.get(int(y_pred[0]), "Unknown")

        # Set an alert flag if severity is High or Critical
        alert = severity_label in ["High", "Critical"]

        # Build response payload
        response = {
            "timestamp": data["timestamp"],
            "source_ip": data["source_ip"],
            "destination_ip": data["destination_ip"],
            "protocol": data["protocol"],
            "predicted_class": int(y_pred[0]),
            "severity": severity_label,
            "alert": alert,
            "probabilities": y_prob.tolist()[0]
        }

        return jsonify(response)

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health():
    """Simple health check endpoint."""
    return jsonify({"status": "OK"}), 200

if __name__ == '__main__':
    # Use a production-ready WSGI server in production.
    app.run(host='172.17.144.1:3000', port=5000, debug=True)
