from pydantic import BaseModel
from typing import List, Optional

class AdvisoryItem(BaseModel):
    id: str
    advisory_type: str  # Sowing, Irrigation, Crop Protection, Heat Stress, Harvesting
    title: str
    severity: str  # LOW, MODERATE, HIGH, CRITICAL
    affected_panchayat: str
    relevant_period: str
    explanation: str
    recommended_action: str
    data_confidence: str

class AdvisoryResponse(BaseModel):
    panchayat_id: str
    panchayat_name: str
    crop_name: str
    advisories: List[AdvisoryItem]
    generated_at: str
