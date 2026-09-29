import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from backend.ml.data_processing.cleaner import DataCleaner
from backend.ml.feature_engineering.feature_builder import FeatureBuilder, FEATURE_COLUMNS
from backend.ml.evaluation.evaluator import ModelEvaluator

def train_and_save_models():
    # Resolve paths relative to project root / script
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    data_path = os.path.join(base_dir, "data", "sample", "sample_historical.csv")
    model_save_path = os.path.join(base_dir, "ml", "trained_models.joblib")

    print(f"[ML Training] Loading dataset from: {data_path}")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Historical training data not found at {data_path}")

    df = pd.read_csv(data_path)

    # Clean data
    cleaner = DataCleaner()
    cleaned_df = cleaner.clean_weather_dataframe(df)

    # Build features
    fb = FeatureBuilder()
    X = fb.build_features(cleaned_df)

    # Targets
    target_cols = [
        "obs_temp_max",
        "obs_temp_min",
        "obs_rainfall_mm",
        "obs_humidity_pct",
        "obs_wind_speed_kmh"
    ]
    y = cleaned_df[target_cols]

    # Scaler & Regressor
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    print("[ML Training] Fitting Random Forest Regressors for downscaling...")
    models = {}
    evaluation_results = {}

    for target in target_cols:
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_scaled, y[target])
        models[target] = model

        # Evaluate on training data
        preds = model.predict(X_scaled)
        metrics = ModelEvaluator.evaluate_predictions(y[target].values, preds, target)
        evaluation_results[target] = metrics

    # Baseline performance (Block forecast as prediction)
    baseline_evals = {
        "obs_temp_max": ModelEvaluator.evaluate_predictions(y["obs_temp_max"].values, cleaned_df["block_temp_max"].values, "block_temp_max_baseline"),
        "obs_temp_min": ModelEvaluator.evaluate_predictions(y["obs_temp_min"].values, cleaned_df["block_temp_min"].values, "block_temp_min_baseline"),
        "obs_rainfall_mm": ModelEvaluator.evaluate_predictions(y["obs_rainfall_mm"].values, cleaned_df["block_rainfall_mm"].values, "block_rainfall_baseline"),
        "obs_humidity_pct": ModelEvaluator.evaluate_predictions(y["obs_humidity_pct"].values, cleaned_df["block_humidity_pct"].values, "block_humidity_baseline"),
        "obs_wind_speed_kmh": ModelEvaluator.evaluate_predictions(y["obs_wind_speed_kmh"].values, cleaned_df["block_wind_speed_kmh"].values, "block_wind_baseline")
    }

    artifact = {
        "models": models,
        "scaler": scaler,
        "feature_columns": FEATURE_COLUMNS,
        "target_columns": target_cols,
        "model_version": "1.0.0-rf-sih",
        "metrics": evaluation_results,
        "baseline_metrics": baseline_evals
    }

    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
    joblib.dump(artifact, model_save_path)
    print(f"[ML Training] Models successfully trained and saved to {model_save_path}")

if __name__ == "__main__":
    train_and_save_models()
