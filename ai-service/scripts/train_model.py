"""
Train the lead scoring model using Random Forest Regressor.
Loads data from data/training_data.csv and saves model to ml_models/lead_scorer.pkl
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
from pathlib import Path

print("Loading training data...")

# Load data
data_dir = Path(__file__).parent.parent / 'data'
data_file = data_dir / 'training_data.csv'

if not data_file.exists():
    print(f"❌ Error: Training data not found at {data_file}")
    print("Please run generate_data.py first!")
    exit(1)

df = pd.read_csv(data_file)

print(f"Loaded {len(df)} records")
print(f"Features: {df.columns.tolist()}")

# Prepare features and target
# Features: company_size, engagement_score, industry_score
X = df[['company_size', 'engagement_score', 'industry_score']].values
y = df['converted'].values

print(f"\nFeature matrix shape: {X.shape}")
print(f"Target vector shape: {y.shape}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\nTraining set: {X_train.shape[0]} samples")
print(f"Test set: {X_test.shape[0]} samples")

# Train Random Forest model
print("\nTraining Random Forest Regressor...")

model = RandomForestRegressor(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

print("✅ Training complete!")

# Evaluate model
print("\nEvaluating model performance...")

y_pred = model.predict(X_test)

mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)

print("\n" + "="*50)
print("MODEL PERFORMANCE METRICS")
print("="*50)
print(f"Mean Squared Error: {mse:.4f}")
print(f"R² Score:          {r2:.4f}")
print(f"Mean Absolute Error: {mae:.4f}")
print("="*50)

# Feature importance
feature_names = ['company_size', 'engagement_score', 'industry_score']
importances = model.feature_importances_

print("\nFeature Importance:")
for name, importance in zip(feature_names, importances):
    print(f"  {name:20s}: {importance:.4f}")

# Save model
print("\nSaving model...")

model_dir = Path(__file__).parent.parent / 'ml_models'
model_dir.mkdir(exist_ok=True)

model_file = model_dir / 'lead_scorer.pkl'
joblib.dump(model, model_file)

print(f"✅ Model saved to: {model_file}")
print(f"\n🎉 Training pipeline complete!")
print(f"\nTo use the model, start the FastAPI service:")
print(f"  uvicorn main:app --reload")

