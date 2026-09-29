from pydantic import BaseModel
from typing import Dict, Any, List

class ModelMetricsResponse(BaseModel):
    model_version: str
    status: str
    metrics: Dict[str, Any]
    baseline_metrics: Dict[str, Any]
    features_used: List[str]
    training_sample_count: int
    last_evaluation_date: str
