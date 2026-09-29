import os
import json
from typing import List, Dict, Any, Optional

class LocationService:
    def __init__(self):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        self.data_path = os.path.join(base_dir, "data", "sample", "sample_panchayats.json")
        self._panchayats = []
        self._load_data()

    def _load_data(self):
        if os.path.exists(self.data_path):
            with open(self.data_path, "r", encoding="utf-8") as f:
                self._panchayats = json.load(f)

    def get_states(self) -> List[str]:
        states = sorted(list(set(p["state_name"] for p in self._panchayats)))
        return states

    def get_districts(self, state_name: Optional[str] = None) -> List[str]:
        filtered = self._panchayats
        if state_name:
            filtered = [p for p in filtered if p["state_name"].lower() == state_name.lower()]
        districts = sorted(list(set(p["district_name"] for p in filtered)))
        return districts

    def get_blocks(self, state_name: Optional[str] = None, district_name: Optional[str] = None) -> List[Dict[str, str]]:
        filtered = self._panchayats
        if state_name:
            filtered = [p for p in filtered if p["state_name"].lower() == state_name.lower()]
        if district_name:
            filtered = [p for p in filtered if p["district_name"].lower() == district_name.lower()]

        seen = set()
        blocks = []
        for p in filtered:
            if p["block_id"] not in seen:
                seen.add(p["block_id"])
                blocks.append({
                    "block_id": p["block_id"],
                    "block_name": p["block_name"],
                    "district_name": p["district_name"],
                    "state_name": p["state_name"]
                })
        return blocks

    def get_panchayats(
        self,
        state_name: Optional[str] = None,
        district_name: Optional[str] = None,
        block_name_or_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        filtered = self._panchayats
        if state_name:
            filtered = [p for p in filtered if p["state_name"].lower() == state_name.lower()]
        if district_name:
            filtered = [p for p in filtered if p["district_name"].lower() == district_name.lower()]
        if block_name_or_id:
            filtered = [
                p for p in filtered
                if p["block_id"].lower() == block_name_or_id.lower() or p["block_name"].lower() == block_name_or_id.lower()
            ]
        return filtered

    def get_panchayat_by_id(self, panchayat_id: str) -> Optional[Dict[str, Any]]:
        for p in self._panchayats:
            if p["panchayat_id"].lower() == panchayat_id.lower():
                return p
        return None

location_service = LocationService()
