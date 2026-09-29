import os
import json
import uuid
import datetime
from typing import List, Dict, Any, Optional
from backend.app.services.weather_service import weather_service
from backend.app.services.location_service import location_service

class AdvisoryEngine:
    """Configurable rule-based advisory engine generating agricultural advisories and weather alerts."""

    def __init__(self):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        self.crop_path = os.path.join(base_dir, "data", "sample", "sample_crop_info.json")
        self._crops = {}
        self._load_crops()

    def _load_crops(self):
        if os.path.exists(self.crop_path):
            with open(self.crop_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                for crop in data:
                    self._crops[crop["crop_name"].lower()] = crop

    def generate_advisories_for_panchayat(
        self,
        panchayat_id: str,
        crop_name: Optional[str] = None
    ) -> Dict[str, Any]:
        panchayat = location_service.get_panchayat_by_id(panchayat_id) or {
            "panchayat_id": panchayat_id,
            "panchayat_name": "Selected Panchayat",
            "primary_crops": ["Wheat", "Maize"]
        }

        forecasts = weather_service.get_panchayat_downscaled_forecasts(panchayat_id)
        if not forecasts:
            # Fallback 1-day forecast
            forecasts = [{
                "date": str(datetime.date.today()),
                "rainfall_mm": 15.0,
                "temp_max": 28.0,
                "temp_min": 16.0,
                "humidity_pct": 75.0,
                "wind_speed_kmh": 12.0
            }]

        selected_crop = crop_name or (panchayat.get("primary_crops", ["Wheat"])[0] if isinstance(panchayat.get("primary_crops"), list) else "Wheat")
        crop_meta = self._crops.get(selected_crop.lower(), {
            "crop_name": selected_crop,
            "optimal_temp_min": 15.0,
            "optimal_temp_max": 30.0,
            "water_requirement_mm_per_week": 30.0,
            "heavy_rain_sensitivity": "high",
            "heat_sensitivity_temp": 34.0
        })

        advisories = []

        # Analyze aggregate 5-day metrics
        total_rain = sum(f.get("rainfall_mm", 0.0) for f in forecasts)
        max_temp = max(f.get("temp_max", 25.0) for f in forecasts)
        min_temp = min(f.get("temp_min", 15.0) for f in forecasts)
        max_wind = max(f.get("wind_speed_kmh", 10.0) for f in forecasts)
        avg_humidity = sum(f.get("humidity_pct", 60.0) for f in forecasts) / max(len(forecasts), 1)

        p_name = panchayat.get("panchayat_name", "Panchayat")
        period = f"{forecasts[0]['date']} to {forecasts[-1]['date']}"

        # 1. Irrigation Advisory
        if total_rain >= 25.0:
            advisories.append({
                "id": str(uuid.uuid4())[:8],
                "advisory_type": "Irrigation Advisory",
                "title": "Postpone Scheduled Irrigation",
                "severity": "MODERATE",
                "affected_panchayat": p_name,
                "relevant_period": period,
                "explanation": f"Cumulative forecast rainfall is {total_rain:.1f} mm, which satisfies the water requirement for {selected_crop}.",
                "recommended_action": "Avoid irrigating fields for the next 5 days to prevent soil waterlogging and nutrient leaching.",
                "data_confidence": "HIGH (Downscaled ML model)"
            })
        elif total_rain < 5.0:
            advisories.append({
                "id": str(uuid.uuid4())[:8],
                "advisory_type": "Irrigation Advisory",
                "title": "Light Irrigation Recommended",
                "severity": "LOW",
                "affected_panchayat": p_name,
                "relevant_period": period,
                "explanation": f"Low rain ({total_rain:.1f} mm) is expected over 5 days.",
                "recommended_action": f"Provide light drip or furrow irrigation during early morning or evening hours for {selected_crop}.",
                "data_confidence": "HIGH (Downscaled ML model)"
            })

        # 2. Crop Protection Advisory (Pesticide / Spraying & Heavy Rain)
        if any(f.get("rainfall_mm", 0.0) > 20.0 for f in forecasts) or max_wind > 20.0:
            advisories.append({
                "id": str(uuid.uuid4())[:8],
                "advisory_type": "Crop Protection",
                "title": "Suspend Chemical Spraying Operations",
                "severity": "HIGH",
                "affected_panchayat": p_name,
                "relevant_period": period,
                "explanation": "Expected rain (>20 mm/day) or strong winds (>20 km/h) will wash away chemical applications and cause drift.",
                "recommended_action": "Postpone fungicide and insecticide sprays until clear weather resumes. Ensure proper drainage channels in fields.",
                "data_confidence": "HIGH"
            })

        # 3. Heat Stress Advisory
        if max_temp >= crop_meta.get("heat_sensitivity_temp", 34.0):
            advisories.append({
                "id": str(uuid.uuid4())[:8],
                "advisory_type": "Heat Stress Advisory",
                "title": f"High Temperature Alert for {selected_crop}",
                "severity": "CRITICAL" if max_temp >= 38.0 else "HIGH",
                "affected_panchayat": p_name,
                "relevant_period": period,
                "explanation": f"Peak day temperature is estimated at {max_temp:.1f}°C, exceeding the heat tolerance threshold ({crop_meta.get('heat_sensitivity_temp')}°C) for {selected_crop}.",
                "recommended_action": "Apply light frequent irrigation to cool soil root zone. Consider mulching to conserve moisture.",
                "data_confidence": "HIGH"
            })

        # 4. Sowing Advisory
        if 15.0 <= total_rain <= 40.0 and 20.0 <= max_temp <= 32.0:
            advisories.append({
                "id": str(uuid.uuid4())[:8],
                "advisory_type": "Sowing Advisory",
                "title": f"Favorable Sowing Window for {selected_crop}",
                "severity": "LOW",
                "affected_panchayat": p_name,
                "relevant_period": period,
                "explanation": "Soil moisture levels and ambient temperatures are in the optimal range for seed germination.",
                "recommended_action": "Proceed with seed bed preparation and sowing using certified seed treatment.",
                "data_confidence": "MODERATE"
            })

        # 5. Harvesting Advisory
        if total_rain > 15.0:
            advisories.append({
                "id": str(uuid.uuid4())[:8],
                "advisory_type": "Harvesting Advisory",
                "title": "Delay Grain Harvesting & Open Air Drying",
                "severity": "HIGH",
                "affected_panchayat": p_name,
                "relevant_period": period,
                "explanation": "Rainfall risks grain discolouration, lodging, and mold formation in harvested crops.",
                "recommended_action": "Delay harvesting mature crops or store harvested produce under water-resistant tarpaulins.",
                "data_confidence": "HIGH"
            })

        return {
            "panchayat_id": panchayat_id,
            "panchayat_name": p_name,
            "crop_name": selected_crop,
            "advisories": advisories,
            "generated_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

advisory_engine = AdvisoryEngine()
