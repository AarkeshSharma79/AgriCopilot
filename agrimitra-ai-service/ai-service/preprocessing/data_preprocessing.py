"""
Tabular data preprocessing helpers for the soil, weather, and crop datasets
referenced under dataset/. These are intended for use when training the
crop-recommendation and yield-prediction models on real historical data;
they are not invoked by the heuristic fallback prediction paths.
"""

from typing import List

import pandas as pd


REQUIRED_SOIL_COLUMNS = ["ph", "nitrogen", "phosphorus", "potassium", "moisture_percent", "soil_type"]
REQUIRED_WEATHER_COLUMNS = ["date", "temp_min_c", "temp_max_c", "rainfall_mm", "humidity_percent"]


def load_csv(path: str) -> pd.DataFrame:
    """Loads a CSV file into a DataFrame, raising a clear error if the file is missing."""
    try:
        return pd.read_csv(path)
    except FileNotFoundError as exc:
        raise FileNotFoundError(
            f"Dataset file not found at '{path}'. Populate dataset/ with real data before training."
        ) from exc


def validate_columns(df: pd.DataFrame, required: List[str], dataset_name: str) -> None:
    """Raises a descriptive error if required columns are missing from a dataset."""
    missing = [col for col in required if col not in df.columns]
    if missing:
        raise ValueError(f"{dataset_name} dataset is missing required columns: {missing}")


def clean_soil_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Basic cleaning for soil datasets: validates schema, drops rows with
    missing critical values, and clips physically implausible values
    (e.g., pH outside 0-14).
    """
    validate_columns(df, REQUIRED_SOIL_COLUMNS, "Soil")

    df = df.dropna(subset=["ph", "moisture_percent"])
    df["ph"] = df["ph"].clip(lower=0, upper=14)
    df["moisture_percent"] = df["moisture_percent"].clip(lower=0, upper=100)

    return df.reset_index(drop=True)


def clean_weather_data(df: pd.DataFrame) -> pd.DataFrame:
    """Basic cleaning for weather datasets: validates schema and parses dates."""
    validate_columns(df, REQUIRED_WEATHER_COLUMNS, "Weather")

    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date"])
    df["rainfall_mm"] = df["rainfall_mm"].clip(lower=0)

    return df.reset_index(drop=True)


def merge_soil_and_weather(soil_df: pd.DataFrame, weather_df: pd.DataFrame, on: str = "farm_id") -> pd.DataFrame:
    """
    Joins soil and weather records on a shared farm/location identifier,
    for use as feature input to the crop-recommendation and yield-prediction
    training pipelines.
    """
    if on not in soil_df.columns or on not in weather_df.columns:
        raise ValueError(f"Both datasets must contain a '{on}' column to merge on.")

    return soil_df.merge(weather_df, on=on, how="inner", suffixes=("_soil", "_weather"))


def train_test_split_by_farm(df: pd.DataFrame, farm_col: str = "farm_id", test_fraction: float = 0.2, seed: int = 42):
    """
    Splits a dataset by farm identifier (rather than by row) so that records
    from the same farm do not leak across train/test sets.
    """
    unique_farms = df[farm_col].unique()
    rng = pd.Series(unique_farms).sample(frac=1, random_state=seed)
    cutoff = int(len(rng) * (1 - test_fraction))

    train_farms = set(rng.iloc[:cutoff])
    test_farms = set(rng.iloc[cutoff:])

    train_df = df[df[farm_col].isin(train_farms)].reset_index(drop=True)
    test_df = df[df[farm_col].isin(test_farms)].reset_index(drop=True)

    return train_df, test_df
