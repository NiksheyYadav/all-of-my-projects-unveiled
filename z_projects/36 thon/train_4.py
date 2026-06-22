# import pandas as pd
# import numpy as np
# import logging
# import joblib
# import json
# from sklearn.model_selection import train_test_split, RandomizedSearchCV, cross_val_score
# from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, StackingRegressor
# from sklearn.preprocessing import StandardScaler
# from sklearn.decomposition import PCA
# from sklearn.feature_selection import RFECV
# from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
# import xgboost as xgb
# import lightgbm as lgb
# from skopt import BayesSearchCV

# # Configure logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# # Load the dataset
# try:
#     logging.info("Loading dataset...")
#     data = pd.read_csv("muppandal_wind_farm_data_latest_train.csv")
#     logging.info("Dataset loaded successfully.")
# except FileNotFoundError:
#     logging.error("Error: 'train.csv' not found. Please ensure the file is in the correct directory.")
#     raise

# # Handle missing values
# if data.isnull().sum().sum() > 0:
#     logging.warning("Dataset contains missing values. Filling with median values.")
#     data.fillna(data.median(), inplace=True)

# # Convert Timestamp to datetime
# data['Timestamp'] = pd.to_datetime(data['Timestamp'])
# data['Month'] = data['Timestamp'].dt.month
# data['Hour'] = data['Timestamp'].dt.hour
# data['DayOfYear'] = data['Timestamp'].dt.dayofyear
# data['Weekend'] = (data['Timestamp'].dt.weekday >= 5).astype(int)

# # Encode categorical variables
# data = pd.get_dummies(data, columns=['Precipitation_Fog', 'Coastal_Proximity', 'Topography_Effect',
#                                      'Mountain_Range_Proximity', 'Ice_Snow_Coverage', 'Soil_Composition', 'Microclimates'], drop_first=True)

# # Function to encode cyclical features
# def encode_cyclical_feature(df, col, max_val):
#     df[col + '_sin'] = np.sin(2 * np.pi * df[col] / max_val)
#     df[col + '_cos'] = np.cos(2 * np.pi * df[col] / max_val)
#     return df

# for cyclical_col, max_val in zip(['Month', 'Hour', 'DayOfYear'], [12, 24, 365]):
#     data = encode_cyclical_feature(data, cyclical_col, max_val)

# # Define features and target
# features = [col for col in data.columns if col not in ['Timestamp', 'Power_Generated_MW']]
# target = 'Power_Generated_MW'
# X = data[features]
# y = data[target]

# # Feature Scaling
# scaler = StandardScaler()
# X_scaled = scaler.fit_transform(X)

# # Feature Selection with Recursive Feature Elimination
# selector = RFECV(xgb.XGBRegressor(), step=1, cv=5)
# X_selected = selector.fit_transform(X_scaled, y)

# # Dimensionality Reduction with PCA
# pca = PCA(n_components=0.95)  # Retain 95% variance
# X_pca = pca.fit_transform(X_selected)

# # Split data
# X_train, X_test, y_train, y_test = train_test_split(X_pca, y, test_size=0.2, random_state=42)

# # Hyperparameter tuning with Bayesian Optimization
# param_grid = {
#     'n_estimators': (50, 300),
#     'max_depth': (3, 20),
#     'learning_rate': (0.01, 0.3, 'log-uniform')
# }

# xgb_model = BayesSearchCV(xgb.XGBRegressor(), param_grid, n_iter=30, cv=3, n_jobs=-1)
# xgb_model.fit(X_train, y_train)

# # Define Stacking Regressor
# stacking_model = StackingRegressor(
#     estimators=[('xgb', xgb.XGBRegressor(**xgb_model.best_params_)),
#                 ('lgb', lgb.LGBMRegressor()),
#                 ('rf', RandomForestRegressor(n_estimators=100))],
#     final_estimator=GradientBoostingRegressor()
# )

# # Train the model
# logging.info("Training the final stacked model...")
# stacking_model.fit(X_train, y_train)

# # Make predictions
# y_pred = stacking_model.predict(X_test)

# # Evaluate the model
# mse = mean_squared_error(y_test, y_pred)
# rmse = np.sqrt(mse)
# mae = mean_absolute_error(y_test, y_pred)
# r2 = r2_score(y_test, y_pred)

# logging.info(f"MSE: {mse}")
# logging.info(f"RMSE: {rmse}")
# logging.info(f"MAE: {mae}")
# logging.info(f"R²: {r2}")

# # Save the trained model
# joblib.dump(stacking_model, 'wind_power_prediction_model_optimized.pkl')

# # Save model metadata
# metadata = {
#     'model_name': 'Stacking Regressor',
#     'base_models': ['XGBoost', 'LightGBM', 'Random Forest'],
#     'hyperparameters': xgb_model.best_params_,
#     'evaluation_metrics': {
#         'MSE': mse,
#         'RMSE': rmse,
#         'MAE': mae,
#         'R2': r2
#     }
# }
# with open('wind_power_model_metadata_optimized.json', 'w') as f:
#     json.dump(metadata, f, indent=4)

# logging.info("Model and metadata saved successfully.")

import pandas as pd
import numpy as np
import logging
import joblib
import json
import optuna
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, StackingRegressor
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.decomposition import PCA
from sklearn.feature_selection import RFECV
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import xgboost as xgb
import lightgbm as lgb
from sklearn.neural_network import MLPRegressor

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load the dataset
try:
    logging.info("Loading dataset...")
    data = pd.read_csv("muppandal_wind_farm_data_latest_train.csv")
    logging.info("Dataset loaded successfully.")
except FileNotFoundError:
    logging.error("Error: 'train.csv' not found. Please ensure the file is in the correct directory.")
    raise

# Handle missing values
if data.isnull().sum().sum() > 0:
    logging.warning("Dataset contains missing values. Filling with median values.")
    data.fillna(data.median(), inplace=True)

# Convert Timestamp to datetime
data['Timestamp'] = pd.to_datetime(data['Timestamp'])
data['Month'] = data['Timestamp'].dt.month
data['Hour'] = data['Timestamp'].dt.hour
data['DayOfYear'] = data['Timestamp'].dt.dayofyear
data['Weekend'] = (data['Timestamp'].dt.weekday >= 5).astype(int)

# Encode categorical variables
data = pd.get_dummies(data, columns=['Precipitation_Fog', 'Coastal_Proximity', 'Topography_Effect',
                                     'Mountain_Range_Proximity', 'Ice_Snow_Coverage', 'Soil_Composition', 'Microclimates'], drop_first=True)

# Function to encode cyclical features
def encode_cyclical_feature(df, col, max_val):
    df[col + '_sin'] = np.sin(2 * np.pi * df[col] / max_val)
    df[col + '_cos'] = np.cos(2 * np.pi * df[col] / max_val)
    return df

for cyclical_col, max_val in zip(['Month', 'Hour', 'DayOfYear'], [12, 24, 365]):
    data = encode_cyclical_feature(data, cyclical_col, max_val)

# Feature Engineering
data['Wind_Speed_Temp_Interaction'] = data['Wind_Speed_mps'] * data['Temperature_C']
data['Wind_Power_Density'] = 0.5 * 1.225 * (data['Wind_Speed_mps'] ** 3)

# Define features and target
features = [col for col in data.columns if col not in ['Timestamp', 'Power_Generated_MW']]
target = 'Power_Generated_MW'
X = data[features]
y = data[target]

# Feature Scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Feature Selection with Recursive Feature Elimination
selector = RFECV(xgb.XGBRegressor(), step=1, cv=5)
X_selected = selector.fit_transform(X_scaled, y)

# Dimensionality Reduction with PCA
pca = PCA(n_components=0.95)
X_pca = pca.fit_transform(X_selected)

# Polynomial Features
poly = PolynomialFeatures(degree=2, interaction_only=True)
X_poly = poly.fit_transform(X_pca)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X_poly, y, test_size=0.2, random_state=42)

# Hyperparameter tuning with Optuna
def objective(trial):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 50, 300),
        'max_depth': trial.suggest_int('max_depth', 3, 20),
        'learning_rate': trial.suggest_loguniform('learning_rate', 0.01, 0.3),
        'subsample': trial.suggest_uniform('subsample', 0.5, 1.0)
    }
    model = xgb.XGBRegressor(**params)
    return np.mean(cross_val_score(model, X_train, y_train, cv=3, scoring='neg_mean_squared_error'))

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=30)
best_params = study.best_params

# Define Stacking Regressor
stacking_model = StackingRegressor(
    estimators=[('xgb', xgb.XGBRegressor(**best_params)),
                ('lgb', lgb.LGBMRegressor()),
                ('rf', RandomForestRegressor(n_estimators=100)),
                ('mlp', MLPRegressor(hidden_layer_sizes=(100, 50), max_iter=500))],
    final_estimator=GradientBoostingRegressor()
)

# Train the model
logging.info("Training the final stacked model...")
stacking_model.fit(X_train, y_train)

# Make predictions
y_pred = stacking_model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

logging.info(f"MSE: {mse}")
logging.info(f"RMSE: {rmse}")
logging.info(f"MAE: {mae}")
logging.info(f"R²: {r2}")

# Save the trained model
joblib.dump(stacking_model, 'wind_power_prediction_model_optimized.pkl')

# Save model metadata
metadata = {
    'model_name': 'Stacking Regressor',
    'base_models': ['XGBoost', 'LightGBM', 'Random Forest', 'MLP Regressor'],
    'hyperparameters': best_params,
    'evaluation_metrics': {
        'MSE': mse,
        'RMSE': rmse,
        'MAE': mae,
        'R2': r2
    }
}
with open('wind_power_model_metadata_optimized_5.json', 'w') as f:
    json.dump(metadata, f, indent=4)

logging.info("Model and metadata saved successfully.")