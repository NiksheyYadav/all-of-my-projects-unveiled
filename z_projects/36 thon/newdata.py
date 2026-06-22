# # import pandas as pd
# # import numpy as np
# # from datetime import datetime

# # # Time range (100 years in years)
# # start_year = 2024
# # end_year = start_year + 100
# # years = range(start_year, end_year)

# # # Create a list to store the data (we'll make a DataFrame later)
# # data = []

# # for year in years:
# #     for month in range(1, 13):  # Loop through months
# #         # Simulate wind speed (example - adjust as needed)
# #         base_wind_speed = 10  # Example
# #         annual_variation = 3   # Example
# #         monthly_variation = 2  # Example
# #         random_std_dev = 2     # Example

# #         # Simplified wind speed simulation (monthly average)
# #         seasonal_component = annual_variation * np.sin(2 * np.pi * (month-1) / 12) # Monthly variation
# #         monthly_component = monthly_variation * np.cos(2 * np.pi * (month-1) / 12) # Monthly variation
# #         random_component = np.random.normal(0, random_std_dev)
# #         wind_speed = base_wind_speed + seasonal_component + monthly_component + random_component
# #         wind_speed = max(0, wind_speed)

# #         # Power output (example - adjust as needed)
# #         rated_power = 1000
# #         if wind_speed < 3 or wind_speed > 25:  # Example cut-in/cut-out
# #             power_output = 0
# #         elif wind_speed < 12:  # Example rated speed
# #             power_output = (wind_speed - 3) / (12 - 3) * rated_power
# #         else:
# #             power_output = rated_power

# #         data.append({'Year': year, 'Month': month, 'Wind Speed (m/s)': wind_speed, 'Power Output (MW)': power_output})

# # # Create DataFrame
# # df = pd.DataFrame(data)

# # # Save to Parquet (efficient)
# # df.to_parquet('muppandal_wind_data_100years_monthly.parquet')

# # print(df.head())
# # print("Data generation complete. File saved as muppandal_wind_data_100years_monthly.parquet")


# # # --- Load and analyze later ---
# # loaded_df = pd.read_parquet('muppandal_wind_data_100years_monthly.parquet')
# # print(loaded_df.describe())

# import pandas as pd
# import numpy as np
# from datetime import datetime, timedelta

# start_date = datetime(2024, 1, 1, 0, 0)
# end_date = start_date + timedelta(days=365 * 100)

# all_data = []

# current_date = start_date
# while current_date < end_date:
#     end_chunk_date = min(current_date + timedelta(days=365), end_date)  # 1-year chunks
#     time_index = pd.date_range(start=current_date, end=end_chunk_date, freq='D')  # Daily frequency (or 'H' for hourly)

#     wind_speed = []
#     power_output = []

#     for t in time_index:
#         day_of_year = t.timetuple().tm_yday
#         # ... (rest of your wind speed and power calculation logic here - same as before) ...
#         wind_speed.append(instantaneous_wind_speed)  # Make sure the variable is named correctly
#         power_output.append(power)  # Make sure the variable is named correctly

#     df_chunk = pd.DataFrame({'Timestamp': time_index, 'Wind Speed (m/s)': wind_speed, 'Power Output (MW)': power_output})
#     all_data.append(df_chunk)

#     current_date = end_chunk_date

# df_full = pd.concat(all_data)

# # --- Save to CSV (BE VERY CAREFUL - THIS WILL BE HUGE) ---
# df_full.to_csv('muppandal_wind_data_100years_daily.csv', index=False)  # Save as CSV

# print("Data generation complete. File saved as muppandal_wind_data_100years_daily.csv (THIS WILL BE A VERY LARGE FILE)")

# # --- (Loading and analysis will be VERY slow with CSV) ---
# # loaded_df = pd.read_csv('muppandal_wind_data_100years_daily.csv')  # Be prepared for this to take a long time
# # print(loaded_df.describe()) # Be prepared for this to take a long time

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

start_date = datetime(2024, 1, 1, 0, 0)
end_date = start_date + timedelta(days=365 * 100)

all_data = []

current_date = start_date
while current_date < end_date:
    end_chunk_date = min(current_date + timedelta(days=365), end_date)  # 1-year chunks
    time_index = pd.date_range(start=current_date, end=end_chunk_date, freq='D')  # Daily frequency (or 'H' for hourly)

    wind_speed = []
    power_output = []

    for t in time_index:
        day_of_year = t.timetuple().tm_yday
        hour_of_day = t.hour # added this line for daily variation.

        base_wind_speed = 10  # Example: Adjust based on Muppandal data (m/s)
        annual_variation = 3   # Example: Adjust based on Muppandal data (m/s)
        daily_variation = 1    # Example: Adjust based on Muppandal data (m/s)
        random_std_dev = 2     # Example: Adjust for realistic fluctuations (m/s)

        seasonal_component = annual_variation * np.sin(2 * np.pi * day_of_year / 365)
        daily_component = daily_variation * np.sin(2 * np.pi * hour_of_day / 24)
        random_component = np.random.normal(0, random_std_dev)

        instantaneous_wind_speed = base_wind_speed + seasonal_component + daily_component + random_component
        instantaneous_wind_speed = max(0, instantaneous_wind_speed)  # Ensure wind speed is not negative

        cut_in_speed = 3      # Example: Adjust based on turbine specs (m/s)
        rated_speed = 12     # Example: Adjust based on turbine specs (m/s)
        cut_out_speed = 25    # Example: Adjust based on turbine specs (m/s)
        rated_power = 1000  # Example: Adjust based on total plant capacity (MW)

        if instantaneous_wind_speed < cut_in_speed or instantaneous_wind_speed > cut_out_speed:
            power = 0
        elif instantaneous_wind_speed < rated_speed:
            power = (instantaneous_wind_speed - cut_in_speed) / (rated_speed - cut_in_speed) * rated_power
        else:
            power = rated_power

        wind_speed.append(instantaneous_wind_speed)
        power_output.append(power)

    df_chunk = pd.DataFrame({'Timestamp': time_index, 'Wind Speed (m/s)': wind_speed, 'Power Output (MW)': power_output})
    all_data.append(df_chunk)

    current_date = end_chunk_date

df_full = pd.concat(all_data)

df_full.to_csv('muppandal_wind_data_100years_daily.csv', index=False)

print("Data generation complete. File saved as muppandal_wind_data_100years_daily.csv (THIS WILL BE A VERY LARGE FILE)")

# ... (Loading and analysis will be VERY slow with CSV) ...