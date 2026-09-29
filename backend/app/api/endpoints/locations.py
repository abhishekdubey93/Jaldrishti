from typing import List, Optional
from fastapi import APIRouter, Query
from backend.app.services.location_service import location_service
from backend.app.schemas.location import PanchayatResponse, BlockResponse

router = APIRouter()

@router.get("/states", response_model=List[str])
def get_states():
    return location_service.get_states()

@router.get("/districts", response_model=List[str])
def get_districts(state: Optional[str] = Query(None)):
    return location_service.get_districts(state)

@router.get("/blocks", response_model=List[BlockResponse])
def get_blocks(state: Optional[str] = Query(None), district: Optional[str] = Query(None)):
    return location_service.get_blocks(state, district)

@router.get("/panchayats", response_model=List[PanchayatResponse])
def get_panchayats(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    block: Optional[str] = Query(None)
):
    return location_service.get_panchayats(state, district, block)
