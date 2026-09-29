import os
from fastapi import APIRouter
from backend.app.config import settings

router = APIRouter()

@router.get("/health")
def check_health():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    model_path = os.path.join(base_dir, "ml", "trained_models.joblib")
    model_available = os.path.exists(model_path)

    return {
        "status": "online",
        "app_name": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "demo_mode": settings.DEMO_MODE,
        "ml_model_loaded": model_available
    }
