from fastapi import APIRouter
from backend.app.services.data_service import data_service

router = APIRouter()

@router.get("/panchayats")
def get_map_panchayats():
    return data_service.get_panchayat_geojson()
