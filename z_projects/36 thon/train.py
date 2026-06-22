import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib  # For saving the model

# Load the dataset
print("Loading dataset...")  # Track progress
try:
    data = pd.read_csv("synthetic_muppandal_wind_farm_data_100y.csv")
    print("Dataset loaded successfully.")
except FileNotFoundError:
    print("Error: 'synthetic_muppandal_wind_farm_data_100y.csv' not found. Please ensure the file is in the correct directory.")
    exit()

# Data preprocessing
print("Preprocessing data...")
data['Timestamp'] = pd.to_datetime(data['Timestamp'])
data['Month'] = data['Timestamp'].dt.month
data['Hour'] = data['Timestamp'].dt.hour
data['DayOfYear'] = data['Timestamp'].dt.dayofyear

features = ['Wind_Speed_mps', 'Wind_Direction_Degrees', 'Temperature_C', 'Air_Pressure_hPa', 'Cloud_Cover_Percentage', 'Month', 'Hour', 'DayOfYear']
target = 'Power_Generated_MW'

X = data[features]
y = data[target]
print("Data preprocessing complete.")

# Split data
print("Splitting data into training and testing sets...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("Data split complete.")

# Create and train the model
print("Creating and training the Random Forest Regressor model...")
model = RandomForestRegressor(n_estimators=100, random_state=42)  # You can tune hyperparameters
model.fit(X_train, y_train)
print("Model training complete.")

# Make predictions
print("Making predictions on the test set...")
y_pred = model.predict(X_test)
print("Predictions complete.")

# Evaluate the model
print("Evaluating the model...")
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Squared Error: {mse}")
print(f"R-squared: {r2}")
print("Model evaluation complete.")


# Example of new data prediction
print("Making prediction on new data...")
new_data = pd.DataFrame({  # Replace with your actual new data
    'Wind_Speed_mps': [7.5],
    'Wind_Direction_Degrees': [250],
    'Temperature_C': [28],
    'Air_Pressure_hPa': [1012],
    'Cloud_Cover_Percentage': [60],
    'Month': [10],
    'Hour': [12],
    'DayOfYear': [280]
})

predicted_power = model.predict(new_data)
print(f"Predicted Power Output: {predicted_power[0]} MW")
print("New data prediction complete.")

# Save the model
print("Saving the trained model...")
joblib.dump(model, 'wind_power_prediction_model.pkl')
print("Model saved successfully.")

print("All tasks completed.")  # Final completion message