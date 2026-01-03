"""Hair Services Package"""
from .yolo_service import YOLOClassifier
from .curvature_data import CURVATURES_DATA, get_treatment_schedule

__all__ = [
    "YOLOClassifier",
    "CURVATURES_DATA",
    "get_treatment_schedule"
]
