from typing import List, Dict, Any
from fastapi import APIRouter
from backend.app.services.data_service import data_service

router = APIRouter()

@router.get("/sources", response_model=List[Dict[str, Any]])
def get_data_sources():
    return data_service.get_data_sources()
