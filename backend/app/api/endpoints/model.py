from fastapi import APIRouter
from backend.app.schemas.model import ModelMetricsResponse
from backend.app.services.data_service import data_service

router = APIRouter()

@router.get("/metrics", response_model=ModelMetricsResponse)
def get_model_metrics():
    return data_service.get_model_metrics()
