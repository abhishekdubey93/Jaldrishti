import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text
from backend.app.database.connection import Base

class PanchayatDB(Base):
    __tablename__ = "panchayats"

    panchayat_id = Column(String, primary_key=True, index=True)
    panchayat_name = Column(String, nullable=False)
    block_id = Column(String, index=True)
    block_name = Column(String, nullable=False)
    district_name = Column(String, nullable=False)
    state_name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_m = Column(Float, default=500.0)
    slope_deg = Column(Float, default=5.0)
    aspect_deg = Column(Float, default=180.0)
    ndvi = Column(Float, default=0.5)
    lst_c = Column(Float, default=25.0)
    soil_type = Column(String, default="Loamy Soil")
    primary_crops = Column(String, default="Wheat, Maize")

class UserFeedbackDB(Base):
    __tablename__ = "user_feedback"

    id = Column(String, primary_key=True, index=True)
    panchayat_id = Column(String, index=True)
    observation_date = Column(String)
    reported_rainfall_mm = Column(Float, nullable=True)
    reported_temp_c = Column(Float, nullable=True)
    advisory_useful = Column(Boolean, default=True)
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
