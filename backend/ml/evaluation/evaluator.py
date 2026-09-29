import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from typing import Dict, Any

class ModelEvaluator:
    """Evaluates ML model performance against ground truth historical observations."""

    @staticmethod
    def evaluate_predictions(y_true: np.ndarray, y_pred: np.ndarray, variable_name: str) -> Dict[str, Any]:
        mae = float(mean_absolute_error(y_true, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
        r2 = float(r2_score(y_true, y_pred)) if len(y_true) > 1 else 1.0

        metrics = {
            "variable": variable_name,
            "mae": round(mae, 3),
            "rmse": round(rmse, 3),
            "r2": round(r2, 3),
            "sample_count": int(len(y_true))
        }

        # If evaluating rainfall, calculate event classification metrics (Rain >= 1mm)
        if "rain" in variable_name.lower():
            rain_true = (y_true >= 1.0).astype(int)
            rain_pred = (y_pred >= 1.0).astype(int)

            tp = np.sum((rain_true == 1) & (rain_pred == 1))
            fp = np.sum((rain_true == 0) & (rain_pred == 1))
            fn = np.sum((rain_true == 1) & (rain_pred == 0))

            precision = float(tp / (tp + fp)) if (tp + fp) > 0 else 1.0
            recall = float(tp / (tp + fn)) if (tp + fn) > 0 else 1.0
            f1 = float(2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 1.0

            metrics["rain_event_metrics"] = {
                "precision": round(precision, 3),
                "recall": round(recall, 3),
                "f1": round(f1, 3)
            }

        return metrics
