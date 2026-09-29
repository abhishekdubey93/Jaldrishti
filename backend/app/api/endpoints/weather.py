from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from backend.app.schemas.weather import (
    BlockForecastSchema,
    PanchayatForecastSchema,
    DownscaleRequest,
    ForecastHorizonResponse
)
from backend.app.services.weather_service import weather_service
from backend.app.services.location_service import location_service
from backend.app.config import settings

router = APIRouter()

@router.get("/block", response_model=List[BlockForecastSchema])
def get_block_weather(block_id: Optional[str] = Query(None)):
    forecasts = weather_service.get_block_forecasts(block_id)
    return forecasts

@router.post("/downscale", response_model=PanchayatForecastSchema)
def downscale_weather(req: DownscaleRequest):
    panchayat = location_service.get_panchayat_by_id(req.panchayat_id)
    if not panchayat:
        raise HTTPException(status_code=404, detail="Panchayat not found")

    block_forecasts = weather_service.get_block_forecasts(req.block_id)
    target_bf = None
    for bf in block_forecasts:
        if bf.get("date") == req.date:
            target_bf = bf
            break
    if not target_bf and block_forecasts:
        target_bf = block_forecasts[0]
    elif not target_bf:
        target_bf = {
            "date": req.date,
            "block_id": req.block_id,
            "block_name": panchayat.get("block_name", "Block"),
            "temp_max": 30.0,
            "temp_min": 18.0,
            "rainfall_mm": 10.0,
            "humidity_pct": 70.0,
            "wind_speed_kmh": 12.0
        }

    pred = weather_service.predictor.downscale_forecast(
        block_forecast=target_bf,
        panchayat_meta=panchayat
    )
    return pred

@router.get("/panchayat/{panchayat_id}", response_model=List[PanchayatForecastSchema])
def get_panchayat_weather(panchayat_id: str):
    return weather_service.get_panchayat_downscaled_forecasts(panchayat_id)

@router.get("/forecast/{panchayat_id}", response_model=ForecastHorizonResponse)
def get_forecast_horizon(panchayat_id: str):
    panchayat = location_service.get_panchayat_by_id(panchayat_id)
    panchayat_forecasts = weather_service.get_panchayat_downscaled_forecasts(panchayat_id)

    block_id = panchayat.get("block_id", "BLK_DHR") if panchayat else "BLK_DHR"
    block_forecasts = weather_service.get_block_forecasts(block_id)

    return {
        "panchayat_id": panchayat_id,
        "horizon_days": len(panchayat_forecasts),
        "forecasts": panchayat_forecasts,
        "block_forecasts": block_forecasts,
        "demo_mode": settings.DEMO_MODE
    }
