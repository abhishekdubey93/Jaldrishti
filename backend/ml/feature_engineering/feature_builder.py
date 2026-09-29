import pandas as pd
import numpy as np
from typing import Dict, Any, List

FEATURE_COLUMNS = [
    "block_temp_max",
    "block_temp_min",
    "block_rainfall_mm",
    "block_humidity_pct",
    "block_wind_speed_kmh",
    "elevation_m",
    "slope_deg",
    "aspect_deg",
    "ndvi",
    "lst_c",
    "latitude",
    "longitude",
    "elevation_diff",
    "lst_temp_diff",
    "month",
    "day_of_year"
]

class FeatureBuilder:
    """Builds features for downscaling weather variables from block level to Panchayat level."""

    def build_features(self, df: pd.DataFrame) -> pd.DataFrame:
        features = df.copy()

        # Date features
        if "date" in features.columns:
            features["date"] = pd.to_datetime(features["date"])
            features["month"] = features["date"].dt.month
            features["day_of_year"] = features["date"].dt.dayofyear
        else:
            features["month"] = 5
            features["day_of_year"] = 135

        # Feature interaction: lapse rate proxy (elevation difference or estimate)
        # Assume average block elevation is approx 500m if not provided
        block_elevation = features.get("block_elevation_m", 500.0)
        features["elevation_diff"] = features["elevation_m"] - block_elevation

        # Thermal interaction feature
        if "block_temp_max" in features.columns and "lst_c" in features.columns:
            features["lst_temp_diff"] = features["lst_c"] - features["block_temp_max"]
        else:
            features["lst_temp_diff"] = 0.0

        # Ensure all required columns exist with fallback defaults
        for col in FEATURE_COLUMNS:
            if col not in features.columns:
                features[col] = 0.0

        return features[FEATURE_COLUMNS]
