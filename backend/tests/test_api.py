from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["app_name"] == "JalDrishti"

def test_get_states():
    response = client.get("/api/locations/states")
    assert response.status_code == 200
    states = response.json()
    assert isinstance(states, list)
    assert len(states) > 0

def test_get_panchayat_weather():
    response = client.get("/api/weather/panchayat/PNC_DHR_01")
    assert response.status_code == 200
    forecasts = response.json()
    assert isinstance(forecasts, list)
    assert len(forecasts) > 0
    assert "rainfall_mm" in forecasts[0]

def test_get_advisories():
    response = client.get("/api/advisories/PNC_DHR_01?crop=Wheat")
    assert response.status_code == 200
    data = response.json()
    assert "advisories" in data
    assert len(data["advisories"]) > 0
