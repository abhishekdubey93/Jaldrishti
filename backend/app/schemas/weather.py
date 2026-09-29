from pydantic import BaseModel
from typing import List, Optional

class BlockForecastSchema(BaseModel):
    date: str
    block_id: str
    block_name: str
    temp_max: float
    temp_min: float
    rainfall_mm: float
    humidity_pct: float
    wind_speed_kmh: float

class PanchayatForecastSchema(BaseModel):
    date: str
    panchayat_id: str
    panchayat_name: str
    temp_max: float
    temp_min: float
    rainfall_mm: float
    humidity_pct: float
    wind_speed_kmh: float
    weather_summary: str
    alert_level: str
    confidence: float
    uncertainty_mm: float
    model_version: str
    data_mode: str

class DownscaleRequest(BaseModel):
    block_id: str
    panchayat_id: str
    date: Optional[str] = "2025-05-15"

class ForecastHorizonResponse(BaseModel):
    panchayat_id: str
    horizon_days: int
    forecasts: List[PanchayatForecastSchema]
    block_forecasts: List[BlockForecastSchema]
    demo_mode: bool
