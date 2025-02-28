import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import joblib

# Load the dataset
data = pd.read_parquet(r'D:\3MCA\neuro\dataset\UNSW_NB15_training-set.parquet')

# Drop target column and get features
X = data.drop(columns=['label'])
y = data['label']

# Apply one-hot encoding (if needed)
X_encoded = pd.get_dummies(X)

# Save the final feature names for inference
joblib.dump(X_encoded.columns.tolist(), 'feature_columns.pkl')

# Split data
X_train, X_val, y_train, y_val = train_test_split(X_encoded, y, test_size=0.2, random_state=42)

# Scale data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Validate
X_val_scaled = scaler.transform(X_val)
y_pred = model.predict(X_val_scaled)
accuracy = accuracy_score(y_val, y_pred)
print(f'Validation Accuracy: {accuracy:.2f}')

# Save the model and scaler
joblib.dump(model, 'ml_model.pkl')
joblib.dump(scaler, 'scaler.pkl')