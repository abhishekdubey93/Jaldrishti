from pydantic import BaseModel
from typing import Optional

class FeedbackCreate(BaseModel):
    panchayat_id: str
    observation_date: str
    reported_rainfall_mm: Optional[float] = None
    reported_temp_c: Optional[float] = None
    advisory_useful: bool
    comments: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: str
    status: str
    message: str
