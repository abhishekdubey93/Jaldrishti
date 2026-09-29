import uuid
from fastapi import APIRouter
from backend.app.schemas.feedback import FeedbackCreate, FeedbackResponse

router = APIRouter()

@router.post("", response_model=FeedbackResponse)
def submit_feedback(fb: FeedbackCreate):
    # In production/SQLite, save record to UserFeedbackDB
    return {
        "id": str(uuid.uuid4()),
        "status": "RECEIVED",
        "message": "Thank you for submitting local weather observations and feedback! It will be reviewed to improve future ML downscaling models."
    }
