# Weather Dataset

Placeholder for historical weather data used to train/validate the
yield-prediction model and to backtest the weather-risk detection rules
used elsewhere in the AgriMitra platform.

## Expected schema (weather.csv)

| column            | type     | description                          |
|-------------------|----------|----------------------------------------|
| farm_id           | string   | Identifier joining to the soil dataset |
| date              | date     | Observation date (YYYY-MM-DD)          |
| temp_min_c        | float    | Minimum temperature (°C)               |
| temp_max_c        | float    | Maximum temperature (°C)               |
| rainfall_mm       | float    | Rainfall (mm)                          |
| humidity_percent  | float    | Relative humidity (%)                  |

Use `preprocessing/data_preprocessing.py`'s `clean_weather_data()` function
to validate and clean this file before training.

## Notes

Live weather forecasts in production are served by a third-party weather
API (see the Node.js backend's `services/weatherService.js`), not by this
dataset. This folder is intended for historical data used in model
training and evaluation only.
