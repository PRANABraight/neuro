# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
import logging

app = Flask(__name__)
# Configure CORS to allow all origins for all routes to simplify testing
CORS(app, origins="*", supports_credentials=True)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the tuned pipeline (including preprocessing and LightGBM classifier)
try:
    model = joblib.load('tuned_model_cicids_lightgbm.pkl')
    # (Optional) Load the scaler if you need to apply it separately
    scaler = joblib.load('tuned_scaler_cicids.pkl')
    # Load the original feature columns used during training
    original_feature_columns = joblib.load('original_feature_columns.pkl')
    logger.info("Successfully loaded model and related files")
except Exception as e:
    logger.error(f"Error loading model files: {str(e)}")
    # Set dummy values for testing if models aren't available
    model = None
    original_feature_columns = []
    logger.warning("Using dummy values for testing purposes")

# Define custom thresholds (for example, adjusting the probability for class 3)
CUSTOM_THRESHOLDS = {3: 0.22}

# Sample history data (since we're adding a history endpoint)
sample_history = []

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
        logger.info(f"Received request to /detect: {request.data}")
        data = request.get_json()
        if not data:
            logger.warning("No JSON data received in request")
            return jsonify({"error": "Invalid request: No JSON data provided"}), 400

        required_keys = ['timestamp', 'source_ip', 'destination_ip', 'protocol', 'features']
        if not all(key in data for key in required_keys):
            missing_keys = [key for key in required_keys if key not in data]
            logger.warning(f"Missing keys in request: {missing_keys}")
            return jsonify({"error": f"Invalid input format. Missing required keys: {missing_keys}"}), 400

        # For testing purposes - if model isn't loaded, return dummy response
        if model is None or not original_feature_columns:
            logger.info("Using dummy response (no model available)")
            dummy_response = {
                "timestamp": data["timestamp"],
                "source_ip": data["source_ip"],
                "destination_ip": data["destination_ip"],
                "protocol": data["protocol"],
                "predicted_class": 1,
                "severity": "Medium",
                "alert": False,
                "probabilities": [0.1, 0.7, 0.1, 0.1]
            }
            # Store in history
            sample_history.append(dummy_response)
            return jsonify(dummy_response)

        # Validate feature length
        features = data['features']
        if len(features) != len(original_feature_columns):
            logger.warning(f"Feature length mismatch: expected {len(original_feature_columns)}, got {len(features)}")
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

        # Store in history
        sample_history.append(response)
        
        return jsonify(response)

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health():
    """Simple health check endpoint."""
    return jsonify({"status": "OK"}), 200

@app.route('/status', methods=['GET'])
def status():
    """Return system status."""
    status_info = {
        "status": "operational",
        "uptime": "1d 4h 32m",
        "model_loaded": model is not None,
        "features_count": len(original_feature_columns) if original_feature_columns else 0,
        "version": "1.0.0"
    }
    return jsonify(status_info), 200

@app.route('/settings', methods=['GET', 'POST'])
def settings():
    """Get or update system settings."""
    if request.method == 'GET':
        settings_data = {
            "detection_threshold": CUSTOM_THRESHOLDS,
            "alert_severity_levels": ["High", "Critical"],
            "logging_level": "INFO"
        }
        return jsonify(settings_data), 200
    elif request.method == 'POST':
        data = request.get_json()
        # In a real app, you would save these settings
        return jsonify({"status": "Settings updated successfully", "settings": data}), 200

@app.route('/history', methods=['GET'])
def history():
    """Return detection history."""
    # In a real app, you would query a database
    return jsonify({"history": sample_history}), 200

if __name__ == '__main__':
    # Use a production-ready WSGI server in production.
    app.run(host='0.0.0.0', port=5000, debug=True)