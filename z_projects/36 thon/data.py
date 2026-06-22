# import requests
# import json
# import csv

# # Coordinates for Bhadla Solar Park, Rajasthan
# latitude = 27.5274
# longitude = 71.9785

# # NASA POWER API URL with required parameters (removed DAYL, keeping others)
# start_date = "20010101"
# end_date = "20250101"
# nasa_url = f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN,T2M,WS10M,RH2M,TS&latitude={latitude}&longitude={longitude}&start={start_date}&end={end_date}&format=JSON&community=AG"

# # Fetch data from NASA API
# response = requests.get(nasa_url)

# try:
#     data = response.json()
#     print(json.dumps(data, indent=4))  # Print full response to debug

#     # Ensure "properties" key exists
#     if "properties" not in data:
#         raise KeyError("NASA API response does not contain 'properties'.")

#     # Extract required parameters
#     parameters = data["properties"]["parameter"]

#     solar_radiation = parameters.get("ALLSKY_SFC_SW_DWN", {})
#     temperature = parameters.get("T2M", {})
#     wind_speed = parameters.get("WS10M", {})
#     humidity = parameters.get("RH2M", {})
#     surface_temperature = parameters.get("TS", {})

#     # Save Data as JSON
#     json_filename = "nasa_power_data_more.json"
#     with open(json_filename, "w") as json_file:
#         json.dump(parameters, json_file, indent=4)

#     # Save Data as CSV
#     csv_filename = "nasa_power_data_more.csv"
#     with open(csv_filename, "w", newline="") as csv_file:
#         fieldnames = ["Date", "Solar Radiation (W/m²)", "Temperature (°C)", "Wind Speed (m/s)", "Humidity (% RH)", "Surface Temperature (°C)"]
#         writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
#         writer.writeheader()

#         for date in solar_radiation.keys():
#             writer.writerow({
#                 "Date": date,
#                 "Solar Radiation (W/m²)": solar_radiation.get(date, None),
#                 "Temperature (°C)": temperature.get(date, None),
#                 "Wind Speed (m/s)": wind_speed.get(date, None),
#                 "Humidity (% RH)": humidity.get(date, None),
#                 "Surface Temperature (°C)": surface_temperature.get(date, None)
#             })

#     print(f"Data saved to '{json_filename}' and '{csv_filename}'")

# except requests.exceptions.RequestException as e:
#     print("Error in API request:", e)
# except KeyError as e:
#     print("KeyError:", e)

# # # import requests
# # # import json
# # # import csv

# # # # Coordinates for Bhadla Solar Park, Rajasthan
# # # latitude = 27.5274
# # # longitude = 71.9785

# # # # NASA POWER API URL with required parameters (hourly temporal resolution)
# # # start_date = "20010101"
# # # end_date = "20250101"
# # # nasa_url = f"https://power.larc.nasa.gov/api/temporal/hourly/point?parameters=ALLSKY_SFC_SW_DWN,T2M,WS10M,RH2M,TS&latitude={latitude}&longitude={longitude}&start={start_date}&end={end_date}&format=JSON&community=AG"

# # # # Fetch data from NASA API
# # # response = requests.get(nasa_url)

# # # try:
# # #     data = response.json()
    
# # #     # Debugging the response (optional, remove if not needed)
# # #     print(json.dumps(data, indent=4))

# # #     # Ensure the 'properties' key exists in the response
# # #     if "properties" not in data:
# # #         raise KeyError("NASA API response does not contain 'properties'.")

# # #     # Extract hourly data
# # #     parameters = data["properties"]["parameter"]
    
# # #     solar_radiation = parameters.get("ALLSKY_SFC_SW_DWN", {})
# # #     temperature = parameters.get("T2M", {})
# # #     wind_speed = parameters.get("WS10M", {})
# # #     humidity = parameters.get("RH2M", {})
# # #     surface_temperature = parameters.get("TS", {})

# # #     # Save Data as JSON
# # #     json_filename = "nasa_power_hourly_data.json"
# # #     with open(json_filename, "w") as json_file:
# # #         json.dump(parameters, json_file, indent=4)

# # #     # Save Data as CSV
# # #     csv_filename = "nasa_power_hourly_data.csv"
# # #     with open(csv_filename, "w", newline="") as csv_file:
# # #         fieldnames = ["Date", "Hour", "Solar Radiation (W/m²)", "Temperature (°C)", "Wind Speed (m/s)", "Humidity (% RH)", "Surface Temperature (°C)"]
# # #         writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
# # #         writer.writeheader()

# # #         # Process hourly data
# # #         for date in solar_radiation.keys():
# # #             for hour in range(24):
# # #                 writer.writerow({
# # #                     "Date": date,
# # #                     "Hour": f"{hour:02d}",
# # #                     "Solar Radiation (W/m²)": solar_radiation.get(date, {}).get(str(hour), None),
# # #                     "Temperature (°C)": temperature.get(date, {}).get(str(hour), None),
# # #                     "Wind Speed (m/s)": wind_speed.get(date, {}).get(str(hour), None),
# # #                     "Humidity (% RH)": humidity.get(date, {}).get(str(hour), None),
# # #                     "Surface Temperature (°C)": surface_temperature.get(date, {}).get(str(hour), None)
# # #                 })

# # #     print(f"Data saved to '{json_filename}' and '{csv_filename}'")

# # # except requests.exceptions.RequestException as e:
# # #     print("Error in API request:", e)
# # # except KeyError as e:
# # #     print("KeyError:", e)

# # import requests
# # import json
# # import csv

# # # Coordinates for Bhadla Solar Park, Rajasthan
# # latitude = 27.5274
# # longitude = 71.9785

# # # NASA POWER API URL with required parameters (hourly temporal resolution)
# # start_date = "20010101"
# # end_date = "20250101"
# # nasa_url = f"https://power.larc.nasa.gov/api/temporal/hourly/point?parameters=ALLSKY_SFC_SW_DWN,T2M,WS10M,RH2M,TS&latitude={latitude}&longitude={longitude}&start={start_date}&end={end_date}&format=JSON&community=AG"

# # # Fetch data from NASA API
# # response = requests.get(nasa_url)

# # try:
# #     # Check if response is OK (status code 200)
# #     if response.status_code != 200:
# #         raise Exception(f"API request failed with status code {response.status_code}: {response.text}")

# #     data = response.json()

# #     # Debugging: Print the full response to examine the error
# #     print(json.dumps(data, indent=4))

# #     # Ensure the 'properties' key exists in the response
# #     if "properties" not in data:
# #         raise KeyError("NASA API response does not contain 'properties'.")

# #     # Extract hourly data
# #     parameters = data["properties"]["parameter"]
# #     # (Continue with the rest of your code...)

# # except requests.exceptions.RequestException as e:
# #     print("Error in API request:", e)
# # except Exception as e:
# #     print("Error:", e)
# # except KeyError as e:
# #     print("KeyError:", e)


import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# Location coordinates (for potential solar integration later)
latitude = 8.2451
longitude = 77.5642

# Time range (1000 years in minutes)
start_date = datetime(2024, 1, 1, 0, 0)  # Start from a reasonable year
end_date = start_date + timedelta(days=365*1000)
time_index = pd.date_range(start=start_date, end=end_date, freq='min')

# Wind speed simulation (simplified - you'll want a better model)
#  - Base wind speed (adjust for Muppandal's average)
#  - Seasonal variation (sinusoidal for simplicity)
#  - Daily variation (smaller sinusoidal)
#  - Random fluctuations (using numpy's normal distribution)

base_wind_speed = 10  # Example: Adjust based on Muppandal data (m/s)
annual_variation = 3   # Example: Adjust based on Muppandal data (m/s)
daily_variation = 1    # Example: Adjust based on Muppandal data (m/s)
random_std_dev = 2     # Example: Adjust for realistic fluctuations (m/s)

wind_speed = []
for t in time_index:
    day_of_year = t.timetuple().tm_yday
    hour_of_day = t.hour

    seasonal_component = annual_variation * np.sin(2 * np.pi * day_of_year / 365)
    daily_component = daily_variation * np.sin(2 * np.pi * hour_of_day / 24)
    random_component = np.random.normal(0, random_std_dev)

    instantaneous_wind_speed = base_wind_speed + seasonal_component + daily_component + random_component
    # Ensure wind speed is not negative (physically impossible)
    instantaneous_wind_speed = max(0, instantaneous_wind_speed)
    wind_speed.append(instantaneous_wind_speed)


# Power generation calculation (simplified - needs real turbine curves)
#  - Assume a simplified power curve:
#    - Cut-in speed (below which no power is generated)
#    - Rated speed (above which power output is constant)
#    - Cut-out speed (above which turbines are shut down for safety)

cut_in_speed = 3      # Example: Adjust based on turbine specs (m/s)
rated_speed = 12     # Example: Adjust based on turbine specs (m/s)
cut_out_speed = 25    # Example: Adjust based on turbine specs (m/s)
rated_power = 1000  # Example: Adjust based on total plant capacity (MW) -  This needs to be in consistent units with your power output.

power_output = []
for ws in wind_speed:
    if ws < cut_in_speed or ws > cut_out_speed:
        power = 0
    elif ws < rated_speed:
        # Simplified power curve (linear for now)
        power = (ws - cut_in_speed) / (rated_speed - cut_in_speed) * rated_power
    else:
        power = rated_power
    power_output.append(power)



# Create DataFrame
df = pd.DataFrame({'Timestamp': time_index, 'Wind Speed (m/s)': wind_speed, 'Power Output (MW)': power_output})

# Save to CSV (optional)
df.to_csv('muppandal_wind_data_1000years.csv', index=False)  # This will be a very large file!

print(df.head())  # Display the first few rows
print("Data generation complete. File saved as muppandal_wind_data_1000years.csv")

# Basic statistics
print("\nBasic Statistics:")
print(df['Power Output (MW)'].describe())