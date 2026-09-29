from fastapi import APIRouter
from backend.app.api.endpoints import health, locations, weather, advisories, map as map_endpoint, model, feedback, sources

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(locations.router, prefix="/locations", tags=["Locations"])
api_router.include_router(weather.router, prefix="/weather", tags=["Weather"])
api_router.include_router(advisories.router, prefix="/advisories", tags=["Advisories"])
api_router.include_router(map_endpoint.router, prefix="/map", tags=["Map"])
api_router.include_router(model.router, prefix="/model", tags=["Model"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["Feedback"])
api_router.include_router(sources.router, prefix="/data", tags=["Data Sources"])
