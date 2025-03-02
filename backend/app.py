from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import json

app = Flask(__name__)

# Load the tuned pipeline (which includes preprocessing and the LightGBM classifier)
model = joblib.load('tuned_model_cicids_lightgbm.pkl')
# Load the fitted numerical scaler (if you need it separately for any reason)
scaler = joblib.load('tuned_scaler_cicids.pkl')
# Load original feature column names for inference
original_feature_columns = joblib.load('original_feature_columns.pkl')

# Custom threshold for class 3; adjust as needed
CUSTOM_THRESHOLDS = {3: 0.22}

def custom_predict_with_thresholds(probabilities, thresholds):
    """
    Apply custom thresholds for specific classes.
    By default, predictions are taken as argmax of the probabilities.
    For each class in thresholds, if the predicted probability is at or above the threshold,
    the prediction is forced to that class.
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
    - features: a list of raw feature values (length should match original_feature_columns)
    
    Returns:
        JSON with predicted severity, probabilities, and alert flag.
    """
    try:
        data = request.get_json()

        # Validate input keys
        required_keys = ['timestamp', 'source_ip', 'destination_ip', 'protocol', 'features']
        if not all(key in data for key in required_keys):
            return jsonify({"error": "Invalid input format. Missing required keys."}), 400

        # Validate feature length
        features = data['features']
        if len(features) != len(original_feature_columns):
            return jsonify({
                "error": f"Expected {len(original_feature_columns)} features, got {len(features)}."
            }), 400

        # Create a DataFrame from the incoming features so that the pipeline can process it
        # The column names must match those used during training.
        input_df = pd.DataFrame([features], columns=original_feature_columns)

        # If you need to apply any additional transformations (like log transforms) that were applied during training,
        # make sure they are included in your pipeline. Here we assume that the pipeline handles all transformations.
        # Predict probabilities
        y_prob = model.predict_proba(input_df)
        # Use custom threshold calibration for class 3
        y_pred = custom_predict_with_thresholds(y_prob, CUSTOM_THRESHOLDS)

        # Map prediction to severity label (0: Low, 1: Medium, 2: High, 3: Critical)
        severity_mapping = {0: "Low", 1: "Medium", 2: "High", 3: "Critical"}
        severity_label = severity_mapping.get(int(y_pred[0]), "Unknown")

        # Optionally, define an alert flag (for example, alert if severity is High or Critical)
        alert = severity_label in ["High", "Critical"]

        # Build the response
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
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "OK"}), 200

if __name__ == '__main__':
    # For development use only; in production, use a production-ready WSGI server.
    app.run(host='0.0.0.0', port=5000, debug=True)
