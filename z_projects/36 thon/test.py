# import pandas as pd
# import numpy as np
# import joblib
# import json

# # Load the trained model
# model = joblib.load('wind_power_prediction_model_4.pkl')

# # Load the model metadata
# with open('wind_power_model_metadata_4.json', 'r') as f:
#     metadata = json.load(f)

# # Display available features
# features = metadata['hyperparameters'].keys()
# print("Enter values for the following features:")

# # Take user input for selected parameters
# input_data = {}
# for feature in features:
#     value = float(input(f"{feature}: "))
#     input_data[feature] = value

# # Convert input data to DataFrame
# input_df = pd.DataFrame([input_data])

# # Predict power output
# predicted_power = model.predict(input_df)
# print(f"Predicted Power Output (MW): {predicted_power[0]}")

import joblib
import json
import numpy as np
import pandas as pd

# Load the trained model
model = joblib.load('wind_power_prediction_model_4.pkl')

# Load metadata to get feature names
with open('wind_power_model_metadata_4.json', 'r') as f:
    metadata = json.load(f)

# Define selected categorical features
selected_features = ['Precipitation_Fog', 'Coastal_Proximity', 'Topography_Effect', 
                     'Mountain_Range_Proximity', 'Ice_Snow_Coverage', 'Soil_Composition', 'Microclimates']

# Take user input for each categorical feature
input_data = {}
for feature in selected_features:
    value = input(f"Enter value for {feature} (0 or 1 for binary categories): ")
    input_data[feature] = int(value)

# Convert to DataFrame
input_df = pd.DataFrame([input_data])

# Ensure all expected features are present
all_features = metadata['hyperparameters'].keys()  # Extract feature names from metadata
for feature in all_features:
    if feature not in input_df.columns:
        input_df[feature] = 0  # Assign default value

# Make prediction
predicted_power = model.predict(input_df)
print(f"Predicted Power Output (MW): {predicted_power[0]}")

