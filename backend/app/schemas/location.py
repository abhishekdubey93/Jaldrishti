from pydantic import BaseModel
from typing import List, Optional

class StateResponse(BaseModel):
    state_name: str

class DistrictResponse(BaseModel):
    district_name: str
    state_name: str

class BlockResponse(BaseModel):
    block_id: str
    block_name: str
    district_name: str
    state_name: str

class PanchayatResponse(BaseModel):
    panchayat_id: str
    panchayat_name: str
    block_id: str
    block_name: str
    district_name: str
    state_name: str
    latitude: float
    longitude: float
    elevation_m: float
    slope_deg: float
    aspect_deg: float
    ndvi: float
    lst_c: float
    soil_type: str
    primary_crops: List[str]
