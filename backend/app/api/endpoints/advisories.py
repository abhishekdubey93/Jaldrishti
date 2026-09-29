from typing import Optional
from fastapi import APIRouter, Query
from backend.app.schemas.advisory import AdvisoryResponse
from backend.app.services.advisory_engine import advisory_engine

router = APIRouter()

@router.get("/{panchayat_id}", response_model=AdvisoryResponse)
def get_panchayat_advisories(panchayat_id: str, crop: Optional[str] = Query(None)):
    return advisory_engine.generate_advisories_for_panchayat(panchayat_id=panchayat_id, crop_name=crop)
