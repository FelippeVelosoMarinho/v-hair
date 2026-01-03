"""
Hair Classification Router
Rotas para classificação de cabelo via imagem
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Optional
import os

from .hair_models import (
    HairClassificationResponse,
    CurvatureInfo,
    CurvatureListResponse,
    Detection
)
from ..services.yolo_service import YOLOClassifier
from ..services.curvature_data import CURVATURES_DATA

router = APIRouter(prefix="/hair", tags=["Hair Classification"])

# Inicializa o classificador YOLO
classifier = YOLOClassifier()


@router.post("/classify", response_model=HairClassificationResponse)
async def classify_hair(
    file: UploadFile = File(...),
    confidence_threshold: Optional[float] = 0.5
):
    """
    Classifica a curvatura do cabelo a partir de uma imagem.
    
    - **file**: Imagem do cabelo (JPG, PNG, JPEG)
    - **confidence_threshold**: Limite mínimo de confiança (0.0 - 1.0)
    
    Retorna o tipo de curvatura detectado (1, 2A-2C, 3A-3C, 4A-4C)
    """
    print(f"\n{'='*50}")
    print(f"📥 NOVA REQUISIÇÃO DE CLASSIFICAÇÃO")
    print(f"{'='*50}")
    print(f"📁 Arquivo: {file.filename}")
    print(f"📊 Content-Type: {file.content_type}")
    print(f"🎯 Threshold de confiança: {confidence_threshold}")
    
    # Validar tipo de arquivo
    allowed_extensions = [".jpg", ".jpeg", ".png"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    print(f"📎 Extensão detectada: {file_ext}")
    
    if file_ext not in allowed_extensions:
        print(f"❌ ERRO: Extensão não permitida")
        raise HTTPException(
            status_code=400,
            detail=f"Formato não suportado. Use: {', '.join(allowed_extensions)}"
        )
    
    try:
        # Ler bytes da imagem
        image_bytes = await file.read()
        print(f"📦 Bytes lidos: {len(image_bytes)} bytes")
        
        # Classificar usando YOLO
        print(f"🔄 Iniciando classificação YOLO...")
        result = classifier.classify(image_bytes, confidence_threshold)
        print(f"📋 Resultado da classificação: {result}")
        
        if result is None:
            print(f"⚠️ Nenhuma detecção encontrada - retornando resposta amigável")
            # Quando não há detecções, retornar resposta amigável
            return HairClassificationResponse(
                curvature="Não detectado",
                confidence=0.0,
                curvature_info=None,
                all_detections=[],
                message="Não foi possível detectar a curvatura do cabelo na imagem. Tente enviar uma foto mais próxima do cabelo com boa iluminação."
            )
        
        # Adicionar informações da curvatura
        print(f"🎯 Curvatura detectada: {result['curvature']} (confiança: {result['confidence']})")
        curvature_info = CURVATURES_DATA.get(result["curvature"])
        print(f"📚 Info da curvatura encontrada: {curvature_info is not None}")
        
        # Converter detecções para objetos Detection
        detections = [
            Detection(
                curvature=det["curvature"],
                confidence=det["confidence"],
                bbox=det.get("bbox")
            )
            for det in result.get("all_detections", [])
        ]
        
        response = HairClassificationResponse(
            curvature=result["curvature"],
            confidence=result["confidence"],
            curvature_info=curvature_info,
            all_detections=detections
        )
        print(f"✅ Resposta final: curvatura={response.curvature}, confiança={response.confidence}")
        print(f"{'='*50}\n")
        return response
        
    except HTTPException:
        print(f"❌ HTTPException levantada")
        raise
    except Exception as e:
        import traceback
        print(f"❌ ERRO INESPERADO: {str(e)}")
        print(f"📜 Traceback completo:")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar imagem: {str(e)}"
        )


@router.get("/curvatures", response_model=CurvatureListResponse)
async def list_curvatures():
    """
    Lista todas as curvaturas de cabelo com suas características.
    
    Retorna informações sobre os tipos 1, 2A-2C, 3A-3C e 4A-4C.
    """
    curvatures = list(CURVATURES_DATA.values())
    return CurvatureListResponse(
        total=len(curvatures),
        curvatures=curvatures
    )


@router.get("/curvatures/{curvature_type}", response_model=CurvatureInfo)
async def get_curvature(curvature_type: str):
    """
    Retorna informações detalhadas sobre um tipo específico de curvatura.
    
    - **curvature_type**: Tipo da curvatura (1, 2A, 2B, 2C, 3A, 3B, 3C, 4A, 4B, 4C)
    """
    curvature_type = curvature_type.upper()
    
    if curvature_type not in CURVATURES_DATA:
        raise HTTPException(
            status_code=404,
            detail=f"Curvatura '{curvature_type}' não encontrada. Valores válidos: {list(CURVATURES_DATA.keys())}"
        )
    
    return CURVATURES_DATA[curvature_type]
