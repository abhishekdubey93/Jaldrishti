import os
import pandas as pd
from typing import List, Dict, Any, Optional
from backend.ml.inference.predictor import WeatherDownscalerPredictor
from backend.app.services.location_service import location_service

class WeatherService:
    def __init__(self):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        self.forecast_path = os.path.join(base_dir, "data", "sample", "sample_block_forecasts.csv")
        self.predictor = WeatherDownscalerPredictor()
        self._block_forecasts_df = None
        self._load_data()

    def _load_data(self):
        if os.path.exists(self.forecast_path):
            self._block_forecasts_df = pd.read_csv(self.forecast_path)

    def get_block_forecasts(self, block_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if self._block_forecasts_df is None or self._block_forecasts_df.empty:
            return []

        df = self._block_forecasts_df
        if block_id:
            df = df[df["block_id"].str.lower() == block_id.lower()]

        return df.to_dict(orient="records")

    def get_panchayat_downscaled_forecasts(self, panchayat_id: str) -> List[Dict[str, Any]]:
        panchayat = location_service.get_panchayat_by_id(panchayat_id)
        if not panchayat:
            # Fallback mock panchayat meta
            panchayat = {
                "panchayat_id": panchayat_id,
                "panchayat_name": "Sample Panchayat",
                "block_id": "BLK_DHR",
                "elevation_m": 1200.0,
                "slope_deg": 8.0,
                "aspect_deg": 180.0,
                "ndvi": 0.6,
                "lst_c": 22.0,
                "latitude": 30.8,
                "longitude": 77.0
            }

        block_id = panchayat.get("block_id", "BLK_DHR")
        block_forecasts = self.get_block_forecasts(block_id)

        # If no block forecasts match, fallback to Dharampur
        if not block_forecasts:
            block_forecasts = self.get_block_forecasts("BLK_DHR")

        downscaled_list = []
        for bf in block_forecasts:
            pred = self.predictor.downscale_forecast(
                block_forecast=bf,
                panchayat_meta=panchayat
            )
            downscaled_list.append(pred)

        return downscaled_list

weather_service = WeatherService()
