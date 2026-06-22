import pandas as pd
import numpy as np
import logging
import joblib
import json
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load the dataset
try:
    logging.info("Loading dataset...")
    data = pd.read_csv("bhadla_solar_synthetic_data_100y.csv")
    logging.info("Dataset loaded successfully.")
except FileNotFoundError:
    logging.error("Error: 'bhadla_solar_synthetic_data_100y.csv' not found. Please ensure the file is in the correct directory.")
    raise

# Check for missing values
if data.isnull().sum().sum() > 0:
    logging.warning("Dataset contains missing values. Filling with mean values.")
    data.fillna(data.mean(), inplace=True)

# Feature Engineering
logging.info("Preprocessing data...")
data['Timestamp'] = pd.to_datetime(data['Timestamp'])
data['Month'] = data['Timestamp'].dt.month
data['Hour'] = data['Timestamp'].dt.hour
data['DayOfYear'] = data['Timestamp'].dt.dayofyear
data['WeekOfYear'] = data['Timestamp'].dt.isocalendar().week
data['Weekend'] = (data['Timestamp'].dt.weekday >= 5).astype(int)

def encode_cyclical_feature(df, col, max_val):
    df[col + '_sin'] = np.sin(2 * np.pi * df[col] / max_val)
    df[col + '_cos'] = np.cos(2 * np.pi * df[col] / max_val)
    return df

for cyclical_col, max_val in zip(['Month', 'Hour', 'DayOfYear'], [12, 24, 365]):
    data = encode_cyclical_feature(data, cyclical_col, max_val)

features = ['Wind_Speed_mps', 'Wind_Direction_Degrees', 'Temperature_C', 'Air_Pressure_hPa', 'Cloud_Cover_Percentage',
            'Month_sin', 'Month_cos', 'Hour_sin', 'Hour_cos', 'DayOfYear_sin', 'DayOfYear_cos', 'WeekOfYear', 'Weekend']
target = 'Power_Generated_MW'

X = data[features]
y = data[target]
logging.info("Data preprocessing complete.")

# Split data
logging.info("Splitting data into training and testing sets...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
logging.info("Data split complete.")

# Simulate 15 epochs of training
num_epochs = 15
for epoch in range(num_epochs):
    logging.info(f"Epoch {epoch+1}/{num_epochs}")

    # Hyperparameter tuning
    logging.info("Tuning hyperparameters for RandomForestRegressor...")
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [10, 20, 30, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    random_search = RandomizedSearchCV(RandomForestRegressor(random_state=42), param_grid, n_iter=10, cv=3, n_jobs=-1, verbose=2)
    random_search.fit(X_train, y_train)
    best_model = random_search.best_estimator_
    logging.info(f"Best hyperparameters: {random_search.best_params_}")

    # Make predictions
    logging.info("Making predictions on the test set...")
    y_pred = best_model.predict(X_test)

    # Evaluate the model
    logging.info("Evaluating the model...")
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    logging.info(f"Epoch {epoch+1} - Mean Squared Error: {mse}")
    logging.info(f"Epoch {epoch+1} - Root Mean Squared Error: {rmse}")
    logging.info(f"Epoch {epoch+1} - Mean Absolute Error: {mae}")
    logging.info(f"Epoch {epoch+1} - R-squared: {r2}")

# Final model saving after all epochs
logging.info("Saving the trained model...")
joblib.dump(best_model, 'solar_power_prediction_model.pkl')
logging.info("Model saved successfully.")

# Save model metadata
metadata = {
    'model_name': 'RandomForestRegressor',
    'hyperparameters': random_search.best_params_,
    'evaluation_metrics': {
        'MSE': mse,
        'RMSE': rmse,
        'MAE': mae,
        'R2': r2
    }
}
with open('solar_power_model_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=4)
logging.info("Model metadata saved.")

# Example of new data prediction
logging.info("Making prediction on new data...")
new_data = pd.DataFrame({
    'Wind_Speed_mps': [5.5],
    'Wind_Direction_Degrees': [200],
    'Temperature_C': [30],
    'Air_Pressure_hPa': [1010],
    'Cloud_Cover_Percentage': [15],
    'Month_sin': [np.sin(2 * np.pi * 7 / 12)],
    'Month_cos': [np.cos(2 * np.pi * 7 / 12)],
    'Hour_sin': [np.sin(2 * np.pi * 14 / 24)],
    'Hour_cos': [np.cos(2 * np.pi * 14 / 24)],
    'DayOfYear_sin': [np.sin(2 * np.pi * 200 / 365)],
    'DayOfYear_cos': [np.cos(2 * np.pi * 200 / 365)],
    'WeekOfYear': [28],
    'Weekend': [0]
})
predicted_power = best_model.predict(new_data)
logging.info(f"Predicted Power Output: {predicted_power[0]} MW")

logging.info("All tasks completed successfully.")
