from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import logging
from datetime import datetime

app = Flask(__name__)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define paths to your model, scaler, and original feature columns
MODEL_PATH = 'model_cicids.pkl'
SCALER_PATH = 'scaler_cicids.pkl'
FEATURE_COLUMNS_PATH = 'original_feature_columns.pkl'

def load_model_and_scaler():
    """Helper function to load the model, scaler, and original feature names."""
    try:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        original_feature_columns = joblib.load(FEATURE_COLUMNS_PATH)
        logger.info("Model, scaler, and feature columns loaded successfully.")
        return model, scaler, original_feature_columns
    except Exception as e:
        logger.error(f"Failed to load model/scaler/feature columns: {e}")
        return None, None, None

# Load model, scaler, and feature names at startup
model, scaler, original_feature_columns = load_model_and_scaler()
if model is None or scaler is None or original_feature_columns is None:
    logger.error("Exiting application because model/scaler/feature columns could not be loaded.")
    exit(1)

# Define severity mapping (assuming multiclass output)
severity_mapping = {
    0: 'Low',
    1: 'Medium',
    2: 'High',
    3: 'Critical'
}

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint to ensure API is up."""
    return jsonify({'status': 'ok', 'message': 'API is healthy.'}), 200

@app.route('/detect', methods=['POST'])
def detect():
    """Endpoint for model inference to detect intrusions."""
    try:
        data = request.get_json(force=True)
        required_fields = ['timestamp', 'source_ip', 'destination_ip', 'protocol', 'features']
        if not all(field in data for field in required_fields):
            logger.warning("Missing one or more required fields.")
            return jsonify({'error': 'Invalid input format, missing fields.'}), 400

        # Validate timestamp format
        try:
            datetime.fromisoformat(data['timestamp'])
        except Exception as e:
            logger.warning(f"Timestamp error: {e}")
            return jsonify({'error': 'Invalid timestamp format.'}), 400

        # Validate and process features (expecting raw features, e.g., 78 numbers)
        features = data.get('features')
        if not isinstance(features, list) or not all(isinstance(x, (int, float)) for x in features):
            logger.warning("Features are not a valid numeric list.")
            return jsonify({'error': 'Invalid features format. Must be a list of numbers.'}), 400

        raw_features = np.array(features).reshape(1, -1)
        expected_feature_count = len(original_feature_columns)
        if raw_features.shape[1] != expected_feature_count:
            return jsonify({'error': f'Expected {expected_feature_count} features, got {raw_features.shape[1]}.'}), 400

        raw_df = pd.DataFrame(raw_features, columns=original_feature_columns)

        # Get model prediction and probabilities
        prediction = int(model.predict(raw_df)[0])
        probabilities = model.predict_proba(raw_df)[0]
        severity = severity_mapping.get(prediction, 'Unknown')
        alert = severity in ['High', 'Critical']

        response = {
            'alert': alert,
            'prediction': prediction,
            'severity': severity,
            'probabilities': probabilities.tolist()
        }
        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error in /detect endpoint: {e}")
        return jsonify({'error': 'Internal server error.'}), 500

@app.route('/debug', methods=['POST'])
def debug():
    """
    Debug endpoint to return detailed model probability scores.
    This is similar to /detect but explicitly returns the probability distribution.
    """
    try:
        data = request.get_json(force=True)
        required_fields = ['timestamp', 'source_ip', 'destination_ip', 'protocol', 'features']
        if not all(field in data for field in required_fields):
            logger.warning("Missing one or more required fields in debug endpoint.")
            return jsonify({'error': 'Invalid input format, missing fields.'}), 400

        # Validate timestamp
        try:
            datetime.fromisoformat(data['timestamp'])
        except Exception as e:
            logger.warning(f"Timestamp error in debug endpoint: {e}")
            return jsonify({'error': 'Invalid timestamp format.'}), 400

        # Process features (raw features)
        features = data.get('features')
        if not isinstance(features, list) or not all(isinstance(x, (int, float)) for x in features):
            logger.warning("Features are not a valid numeric list in debug endpoint.")
            return jsonify({'error': 'Invalid features format. Must be a list of numbers.'}), 400

        raw_features = np.array(features).reshape(1, -1)
        expected_feature_count = len(original_feature_columns)
        if raw_features.shape[1] != expected_feature_count:
            return jsonify({'error': f'Expected {expected_feature_count} features, got {raw_features.shape[1]}.'}), 400

        raw_df = pd.DataFrame(raw_features, columns=original_feature_columns)

        # Get prediction probabilities and predicted class
        probabilities = model.predict_proba(raw_df)[0]
        prediction = int(model.predict(raw_df)[0])
        severity = severity_mapping.get(prediction, 'Unknown')
        alert = severity in ['High', 'Critical']

        debug_info = {
            'prediction': prediction,
            'severity': severity,
            'probabilities': probabilities.tolist()
        }
        return jsonify(debug_info), 200

    except Exception as e:
        logger.error(f"Error in /debug endpoint: {e}")
        return jsonify({'error': 'Internal server error in debug endpoint.'}), 500

@app.route('/update-model', methods=['POST'])
def update_model():
    """
    Endpoint to reload/update the model, scaler, and feature names.
    This allows you to update the model without restarting the server.
    """
    try:
        global model, scaler, original_feature_columns
        model, scaler, original_feature_columns = load_model_and_scaler()
        if model is None or scaler is None or original_feature_columns is None:
            return jsonify({'error': 'Failed to update model.'}), 500
        return jsonify({'message': 'Model updated successfully.'}), 200
    except Exception as e:
        logger.error(f"Error in /update-model endpoint: {e}")
        return jsonify({'error': 'Internal server error during model update.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
