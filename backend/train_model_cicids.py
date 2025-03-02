import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import joblib

# Define file paths
file_paths = [
    r"D:\3MCA\neuro\dataset\Friday-WorkingHours-Afternoon-DDos.pcap_ISCX.csv",
    r"D:\3MCA\neuro\dataset\Friday-WorkingHours-Afternoon-PortScan.pcap_ISCX.csv",
    r"D:\3MCA\neuro\dataset\Friday-WorkingHours-Morning.pcap_ISCX.csv",
    r"D:\3MCA\neuro\dataset\Monday-WorkingHours.pcap_ISCX.csv",
    r"D:\3MCA\neuro\dataset\Thursday-WorkingHours-Afternoon-Infilteration.pcap_ISCX.csv",
    r"D:\3MCA\neuro\dataset\Thursday-WorkingHours-Morning-WebAttacks.pcap_ISCX.csv",
    r"D:\3MCA\neuro\dataset\Tuesday-WorkingHours.pcap_ISCX.csv",
    r"D:\3MCA\neuro\dataset\Wednesday-workingHours.pcap_ISCX.csv"
]

# Define attack type mapping based on file names
attack_type_mapping = {
    "DDos": "DDos",
    "PortScan": "PortScan",
    "Infilteration": "Infilteration",
    "WebAttacks": "WebAttacks",
    "Morning": "Benign",
    "Afternoon": "Benign",
    "Monday": "Benign",
    "Tuesday": "Benign",
    "Wednesday": "Benign",
    "Thursday": "Benign",
    "Friday": "Benign"
}

# Load and combine data
data_frames = []
for file_path in file_paths:
    df = pd.read_csv(file_path)
    for key, value in attack_type_mapping.items():
        if key in file_path:
            df['attack_type'] = value
            break
    data_frames.append(df)

combined_df = pd.concat(data_frames, ignore_index=True)

# Define severity mapping
severity_mapping = {
    "Benign": 0,
    "PortScan": 1,
    "Probe": 1,
    "DDos": 2,
    "Infilteration": 3,
    "WebAttacks": 3
}

# Map attack_type to severity
combined_df['severity'] = combined_df['attack_type'].map(severity_mapping)

# Replace infinite values and handle large values
combined_df.replace([np.inf, -np.inf], np.nan, inplace=True)
combined_df.fillna(combined_df.mean(), inplace=True)

# Separate features and target
X = combined_df.drop(columns=['attack_type', 'severity'])
y = combined_df['severity']

# Identify categorical and numerical features
categorical_features = X.select_dtypes(include=['object']).columns
numerical_features = X.select_dtypes(include=[np.number]).columns

# Preprocess the data
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# Create a pipeline with the preprocessor and classifier
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

# Split the data into training and validation sets
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
pipeline.fit(X_train, y_train)

# Evaluate the model
y_pred = pipeline.predict(X_val)
print(classification_report(y_val, y_pred))
print(confusion_matrix(y_val, y_pred))

# Save the model and scaler
joblib.dump(pipeline, 'model_cicids.pkl')
joblib.dump(preprocessor.named_transformers_['num'], 'scaler_cicids.pkl')