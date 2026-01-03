"""Hair Routers Package"""
from .hair_router import router
from .hair_models import (
    HairClassificationResponse,
    CurvatureInfo,
    CurvatureListResponse,
    Detection
)

__all__ = [
    "router",
    "HairClassificationResponse",
    "CurvatureInfo",
    "CurvatureListResponse",
    "Detection"
]
