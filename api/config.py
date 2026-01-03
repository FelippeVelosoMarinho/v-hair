"""
Configurações da aplicação
"""
import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Configurações da aplicação"""
    
    # App
    APP_NAME: str = "Zohan Virtual API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    
    # CORS
    VITE_APP_URL: Optional[str] = "http://localhost:3000"
    
    # OpenAI
    OPENAI_KEY: Optional[str] = None
    
    # YOLO Model
    YOLO_MODEL_PATH: Optional[str] = None
    YOLO_CONFIDENCE_THRESHOLD: float = 0.5
    
    # Database (Fase 2)
    DATABASE_URL: Optional[str] = None
    
    # Redis (Fase 2)
    REDIS_URL: Optional[str] = None
    
    class Config:
        env_file = ".env"
        extra = "ignore"


# Instância global de configurações
settings = Settings()


# Caminhos importantes
BASE_DIR = Path(__file__).parent
HAIR_MODELS_DIR = BASE_DIR / "hair" / "models"
TMP_DIR = BASE_DIR / "tmp"

# Garantir que diretórios existam
TMP_DIR.mkdir(exist_ok=True)
