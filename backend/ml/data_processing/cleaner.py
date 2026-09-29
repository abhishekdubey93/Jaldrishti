import pandas as pd
import numpy as np
from typing import Dict, Any, List

class DataCleaner:
    """Handles data cleaning, outlier removal, and missing value imputation for JalDrishti."""

    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {
            "temp_min": -10.0,
            "temp_max": 55.0,
            "rainfall_min": 0.0,
            "rainfall_max": 500.0,
            "humidity_min": 0.0,
            "humidity_max": 100.0,
            "wind_speed_min": 0.0,
            "wind_speed_max": 150.0
        }

    def clean_weather_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """Cleans weather dataframe by validating ranges, removing duplicates, and filling NaNs."""
        cleaned = df.copy()

        # Remove duplicates
        if "date" in cleaned.columns and "panchayat_id" in cleaned.columns:
            cleaned = cleaned.drop_duplicates(subset=["date", "panchayat_id"])
        elif "date" in cleaned.columns and "block_id" in cleaned.columns:
            cleaned = cleaned.drop_duplicates(subset=["date", "block_id"])

        # Clip numeric values within physical ranges
        for col in ["obs_temp_max", "block_temp_max", "temp_max"]:
            if col in cleaned.columns:
                cleaned[col] = cleaned[col].clip(self.config["temp_min"], self.config["temp_max"])

        for col in ["obs_temp_min", "block_temp_min", "temp_min"]:
            if col in cleaned.columns:
                cleaned[col] = cleaned[col].clip(self.config["temp_min"], self.config["temp_max"])

        for col in ["obs_rainfall_mm", "block_rainfall_mm", "rainfall_mm"]:
            if col in cleaned.columns:
                cleaned[col] = cleaned[col].clip(self.config["rainfall_min"], self.config["rainfall_max"])

        for col in ["obs_humidity_pct", "block_humidity_pct", "humidity_pct"]:
            if col in cleaned.columns:
                cleaned[col] = cleaned[col].clip(self.config["humidity_min"], self.config["humidity_max"])

        for col in ["obs_wind_speed_kmh", "block_wind_speed_kmh", "wind_speed_kmh"]:
            if col in cleaned.columns:
                cleaned[col] = cleaned[col].clip(self.config["wind_speed_min"], self.config["wind_speed_max"])

        # Handle missing values
        numeric_cols = cleaned.select_dtypes(include=[np.number]).columns
        cleaned[numeric_cols] = cleaned[numeric_cols].fillna(cleaned[numeric_cols].median())

        return cleaned
