import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from backend.ml.feature_engineering.feature_builder import FeatureBuilder

class WeatherDownscalerPredictor:
    """Inference predictor that loads trained downscaling model artifacts and outputs Panchayat forecasts."""

    def __init__(self, model_path: str = None):
        if model_path is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            model_path = os.path.join(base_dir, "ml", "trained_models.joblib")

        self.model_path = model_path
        self.artifact = None
        self.load_model()

    def load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.artifact = joblib.load(self.model_path)
                print(f"[Predictor] Successfully loaded ML model from {self.model_path}")
            except Exception as e:
                print(f"[Predictor] Error loading model file: {e}")
                self.artifact = None
        else:
            print(f"[Predictor] Model file not found at {self.model_path}. Will use physics-based fallback estimation.")

    def downscale_forecast(
        self,
        block_forecast: Dict[str, Any],
        panchayat_meta: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Downscales a single day block forecast for a given Panchayat using loaded ML model or intelligent heuristic fallback."""

        # Prepare input record combining block weather + panchayat spatial features
        record = {
            "block_temp_max": block_forecast.get("temp_max", 30.0),
            "block_temp_min": block_forecast.get("temp_min", 20.0),
            "block_rainfall_mm": block_forecast.get("rainfall_mm", 10.0),
            "block_humidity_pct": block_forecast.get("humidity_pct", 70.0),
            "block_wind_speed_kmh": block_forecast.get("wind_speed_kmh", 12.0),
            "elevation_m": panchayat_meta.get("elevation_m", 500.0),
            "slope_deg": panchayat_meta.get("slope_deg", 5.0),
            "aspect_deg": panchayat_meta.get("aspect_deg", 180.0),
            "ndvi": panchayat_meta.get("ndvi", 0.5),
            "lst_c": panchayat_meta.get("lst_c", 25.0),
            "latitude": panchayat_meta.get("latitude", 25.0),
            "longitude": panchayat_meta.get("longitude", 75.0),
            "date": block_forecast.get("date", "2025-05-15")
        }

        if self.artifact is not None:
            fb = FeatureBuilder()
            df = pd.DataFrame([record])
            X = fb.build_features(df)
            X_scaled = self.artifact["scaler"].transform(X)

            models = self.artifact["models"]
            pred_temp_max = float(models["obs_temp_max"].predict(X_scaled)[0])
            pred_temp_min = float(models["obs_temp_min"].predict(X_scaled)[0])
            pred_rain = float(models["obs_rainfall_mm"].predict(X_scaled)[0])
            pred_humidity = float(models["obs_humidity_pct"].predict(X_scaled)[0])
            pred_wind = float(models["obs_wind_speed_kmh"].predict(X_scaled)[0])

            confidence = 0.92
            model_version = self.artifact.get("model_version", "1.0.0-rf-sih")
            data_mode = "TRAINED_ML_MODEL"
        else:
            # Physics-based lapse rate & terrain downscaling fallback
            elevation = record["elevation_m"]
            # Standard environmental lapse rate (~6.5°C per 1000m)
            ele_diff_km = (elevation - 500.0) / 1000.0
            temp_adjustment = -6.5 * ele_diff_km

            # Orographic rainfall factor
            slope_factor = 1.0 + (record["slope_deg"] / 50.0)

            pred_temp_max = max(record["block_temp_max"] + temp_adjustment, 0.0)
            pred_temp_min = max(record["block_temp_min"] + temp_adjustment, -5.0)
            pred_rain = max(record["block_rainfall_mm"] * slope_factor, 0.0)
            pred_humidity = min(max(record["block_humidity_pct"] + (ele_diff_km * 5.0), 10.0), 100.0)
            pred_wind = max(record["block_wind_speed_kmh"] * (1.0 + ele_diff_km * 0.2), 1.0)

            confidence = 0.82
            model_version = "1.0.0-statistical-fallback"
            data_mode = "STATISTICAL_DOWNSCALING"

        # Round outputs nicely
        pred_temp_max = round(pred_temp_max, 1)
        pred_temp_min = round(pred_temp_min, 1)
        pred_rain = round(pred_rain, 1)
        pred_humidity = round(pred_humidity, 1)
        pred_wind = round(pred_wind, 1)

        # Weather summary & Alert determination
        summary, alert_level = self._generate_summary_and_alert(pred_rain, pred_temp_max, pred_wind)

        return {
            "date": record["date"],
            "panchayat_id": panchayat_meta.get("panchayat_id", "PNC_UNKNOWN"),
            "panchayat_name": panchayat_meta.get("panchayat_name", "Unknown Panchayat"),
            "temp_max": pred_temp_max,
            "temp_min": pred_temp_min,
            "rainfall_mm": pred_rain,
            "humidity_pct": pred_humidity,
            "wind_speed_kmh": pred_wind,
            "weather_summary": summary,
            "alert_level": alert_level,
            "confidence": confidence,
            "uncertainty_mm": round(max(pred_rain * 0.15, 1.2), 1),
            "model_version": model_version,
            "data_mode": data_mode
        }

    def _generate_summary_and_alert(self, rain: float, temp_max: float, wind: float):
        if rain >= 30.0:
            return "Heavy Rainfall Expected", "HEAVY_RAIN"
        elif rain >= 10.0:
            return "Moderate Rain", "MODERATE"
        elif temp_max >= 38.0:
            return "Extreme Heat Wave", "HEAT_WAVE"
        elif temp_max >= 34.0:
            return "High Temperature Alert", "HIGH_TEMP"
        elif wind >= 25.0:
            return "High Wind Warning", "HIGH_WIND"
        elif rain > 0.0:
            return "Light Showers", "NORMAL"
        else:
            return "Clear / Partly Cloudy", "NORMAL"
