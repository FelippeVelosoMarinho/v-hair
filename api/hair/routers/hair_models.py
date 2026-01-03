"""
Hair Classification Models
Modelos Pydantic para a API de classificação de cabelo
"""
from pydantic import BaseModel, Field
from typing import List, Optional


class CurvatureInfo(BaseModel):
    """Informações sobre um tipo de curvatura"""
    id: str = Field(..., description="Identificador da curvatura (1, 2A, 3B, etc.)")
    name: str = Field(..., description="Nome descritivo")
    description: str = Field(..., description="Descrição do tipo de cabelo")
    characteristics: List[str] = Field(default=[], description="Características principais")
    care_tips: List[str] = Field(default=[], description="Dicas de cuidados")
    porosity: Optional[str] = Field(None, description="Porosidade comum")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "3A",
                "name": "Cacheado A",
                "description": "Cachos largos e soltos em forma de S",
                "characteristics": [
                    "Cachos bem definidos",
                    "Textura macia",
                    "Propenso a frizz"
                ],
                "care_tips": [
                    "Hidratação semanal",
                    "Usar leave-in",
                    "Evitar sulfatos"
                ],
                "porosity": "média"
            }
        }


class Detection(BaseModel):
    """Uma detecção individual do modelo"""
    curvature: str
    confidence: float
    bbox: Optional[List[float]] = Field(None, description="Bounding box [x1, y1, x2, y2]")


class HairClassificationResponse(BaseModel):
    """Resposta da classificação de cabelo"""
    curvature: str = Field(..., description="Tipo de curvatura detectado")
    confidence: float = Field(..., ge=0, le=1, description="Nível de confiança da detecção")
    curvature_info: Optional[CurvatureInfo] = Field(None, description="Informações sobre a curvatura")
    all_detections: List[Detection] = Field(default=[], description="Todas as detecções encontradas")
    message: Optional[str] = Field(None, description="Mensagem adicional para o usuário")
    
    class Config:
        json_schema_extra = {
            "example": {
                "curvature": "3A",
                "confidence": 0.92,
                "curvature_info": {
                    "id": "3A",
                    "name": "Cacheado A",
                    "description": "Cachos largos e soltos em forma de S",
                    "characteristics": ["Cachos bem definidos"],
                    "care_tips": ["Hidratação semanal"],
                    "porosity": "média"
                },
                "all_detections": [
                    {"curvature": "3A", "confidence": 0.92, "bbox": [100, 50, 400, 350]}
                ]
            }
        }


class CurvatureListResponse(BaseModel):
    """Lista de curvaturas"""
    total: int
    curvatures: List[CurvatureInfo]
