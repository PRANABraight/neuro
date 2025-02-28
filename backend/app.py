from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)

# Load the trained model, scaler, and feature names
model = joblib.load('ml_model.pkl')
scaler = joblib.load('scaler.pkl')
feature_columns = joblib.load('feature_columns.pkl')  # This defines feature_columns

def preprocess_features(features):
    """
    Convert incoming raw features into a DataFrame, apply one-hot encoding,
    and reindex to match the training columns.
    """
    # Create DataFrame with the expected raw columns
    # Note: You need to know the order and names of the raw features.
    # For example, if you expect 35 raw values:
    raw_column_names = [
        'dur', 'proto', 'service', 'state', 'spkts', 'dpkts', 'sbytes', 'dbytes',
        'rate', 'sload', 'dload', 'sloss', 'dloss', 'sinpkt', 'dinpkt', 'sjit',
        'djit', 'swin', 'stcpb', 'dtcpb', 'dwin', 'tcprtt', 'synack', 'ackdat',
        'smean', 'dmean', 'trans_depth', 'response_body_len', 'ct_src_dport_ltm',
        'ct_dst_sport_ltm', 'is_ftp_login', 'ct_ftp_cmd', 'ct_flw_http_mthd',
        'is_sm_ips_ports', 'attack_cat'
    ]
    
    # Create a DataFrame from the raw features
    df = pd.DataFrame([features], columns=raw_column_names)
    
    # Apply one-hot encoding
    df_encoded = pd.get_dummies(df)
    
    # Reindex to ensure the same columns as during training
    df_encoded = df_encoded.reindex(columns=feature_columns, fill_value=0)
    return df_encoded

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Real-Time IDS API. Use the /detect endpoint to submit data.", 200

@app.route('/detect', methods=['POST'])
def detect():
    try:
        data = request.get_json()
        raw_features = data.get('features')
        if not raw_features:
            return jsonify({'error': "Missing 'features' key in JSON payload"}), 400

        # Preprocess input data
        processed_features = preprocess_features(raw_features)
        # features_array = processed_features.values
        # features_scaled = scaler.transform(features_array)

        # Do this:
        features_scaled = scaler.transform(processed_features)
        prediction = model.predict(features_scaled)
        return jsonify({'prediction': str(prediction[0])})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
