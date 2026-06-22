import requests
import json
import csv
import matplotlib.pyplot as plt
import pandas as pd

# Coordinates for Bhadla Solar Park, Rajasthan
latitude = 27.5274
longitude = 71.9785

# NASA POWER API URL with required parameters (removed DAYL, keeping others)
start_date = "20010101"
end_date = "20250101"
nasa_url = f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN,T2M,WS10M,RH2M,TS&latitude={latitude}&longitude={longitude}&start={start_date}&end={end_date}&format=JSON&community=AG"

# Fetch data from NASA API
response = requests.get(nasa_url)

try:
    data = response.json()
    
    if "properties" not in data:
        raise KeyError("NASA API response does not contain 'properties'.")

    # Extract required parameters
    parameters = data["properties"]["parameter"]

    solar_radiation = parameters.get("ALLSKY_SFC_SW_DWN", {})
    temperature = parameters.get("T2M", {})
    wind_speed = parameters.get("WS10M", {})
    humidity = parameters.get("RH2M", {})
    surface_temperature = parameters.get("TS", {})

    # Convert data to a Pandas DataFrame for easier plotting
    df = pd.DataFrame({
        "Date": list(solar_radiation.keys()),
        "Solar Radiation (W/m²)": list(solar_radiation.values()),
        "Temperature (°C)": list(temperature.values()),
        "Wind Speed (m/s)": list(wind_speed.values()),
        "Humidity (% RH)": list(humidity.values()),
        "Surface Temperature (°C)": list(surface_temperature.values())
    })

    # Convert 'Date' to a datetime object
    df['Date'] = pd.to_datetime(df['Date'], format='%Y%m%d')

    # Plot the data
    plt.figure(figsize=(10, 6))

    # Plot each parameter
    plt.subplot(3, 2, 1)
    plt.plot(df['Date'], df['Solar Radiation (W/m²)'], label='Solar Radiation (W/m²)', color='orange')
    plt.title('Solar Radiation Over Time')
    plt.xlabel('Date')
    plt.ylabel('Solar Radiation (W/m²)')

    plt.subplot(3, 2, 2)
    plt.plot(df['Date'], df['Temperature (°C)'], label='Temperature (°C)', color='red')
    plt.title('Temperature Over Time')
    plt.xlabel('Date')
    plt.ylabel('Temperature (°C)')

    plt.subplot(3, 2, 3)
    plt.plot(df['Date'], df['Wind Speed (m/s)'], label='Wind Speed (m/s)', color='blue')
    plt.title('Wind Speed Over Time')
    plt.xlabel('Date')
    plt.ylabel('Wind Speed (m/s)')

    plt.subplot(3, 2, 4)
    plt.plot(df['Date'], df['Humidity (% RH)'], label='Humidity (% RH)', color='green')
    plt.title('Humidity Over Time')
    plt.xlabel('Date')
    plt.ylabel('Humidity (% RH)')

    plt.subplot(3, 2, 5)
    plt.plot(df['Date'], df['Surface Temperature (°C)'], label='Surface Temperature (°C)', color='purple')
    plt.title('Surface Temperature Over Time')
    plt.xlabel('Date')
    plt.ylabel('Surface Temperature (°C)')

    plt.tight_layout()
    plt.show()

    # Save Data as JSON and CSV
    json_filename = "nasa_power_data.json"
    with open(json_filename, "w") as json_file:
        json.dump(parameters, json_file, indent=4)

    csv_filename = "nasa_power_data.csv"
    df.to_csv(csv_filename, index=False)

    print(f"Data saved to '{json_filename}' and '{csv_filename}'")

except requests.exceptions.RequestException as e:
    print("Error in API request:", e)
except KeyError as e:
    print("KeyError:", e)
