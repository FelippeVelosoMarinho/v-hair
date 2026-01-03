"""
YOLO Classification Service
Serviço para classificação de curvatura capilar usando YOLOv8
"""
import io
import os
from pathlib import Path
from typing import Optional, Dict, List, Any
import numpy as np

from PIL import Image


class YOLOClassifier:
    """Classificador de curvatura capilar usando YOLOv8"""
    
    # Mapeamento de classes do modelo
    HAIR_TYPES = {
        0: "1",
        1: "2A",
        2: "2B",
        3: "2C",
        4: "3A",
        5: "3B",
        6: "3C",
        7: "4A",
        8: "4B",
        9: "4C",
    }
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Inicializa o classificador YOLO.
        
        Args:
            model_path: Caminho para o modelo .pt treinado.
                       Se None, usa o modelo padrão em hair/models/best.pt
        """
        self.model = None
        self.model_path = model_path or self._get_default_model_path()
        self._load_model()
    
    def _get_default_model_path(self) -> str:
        """Retorna o caminho padrão do modelo"""
        current_dir = Path(__file__).parent.parent
        return str(current_dir / "models" / "best.pt")
    
    def _load_model(self):
        """Carrega o modelo YOLO"""
        try:
            from ultralytics import YOLO
            
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(
                    f"Modelo não encontrado em: {self.model_path}. "
                    "Copie o arquivo best.pt do treinamento para api/hair/models/"
                )
            
            self.model = YOLO(self.model_path)
            print(f"✅ Modelo YOLO carregado: {self.model_path}")
            
        except ImportError:
            raise ImportError(
                "ultralytics não instalado. Execute: pip install ultralytics"
            )
    
    def preprocess_image(self, image_bytes: bytes, target_size: tuple = (640, 640)) -> Image.Image:
        """
        Pré-processa a imagem para o formato esperado pelo modelo.
        
        Args:
            image_bytes: Bytes da imagem
            target_size: Tamanho alvo (largura, altura)
            
        Returns:
            Imagem PIL processada
        """
        # Abrir imagem
        image = Image.open(io.BytesIO(image_bytes))
        
        # Converter para RGB se necessário
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Redimensionar mantendo aspect ratio
        original_size = image.size
        ratio = min(target_size[0] / original_size[0], target_size[1] / original_size[1])
        new_size = (int(original_size[0] * ratio), int(original_size[1] * ratio))
        
        image = image.resize(new_size, Image.Resampling.LANCZOS)
        
        # Criar imagem com padding (fundo branco)
        padded_image = Image.new("RGB", target_size, (255, 255, 255))
        
        # Centralizar a imagem redimensionada
        offset = ((target_size[0] - new_size[0]) // 2, (target_size[1] - new_size[1]) // 2)
        padded_image.paste(image, offset)
        
        return padded_image
    
    def classify(
        self, 
        image_bytes: bytes, 
        confidence_threshold: float = 0.5
    ) -> Optional[Dict[str, Any]]:
        """
        Classifica a curvatura do cabelo na imagem.
        
        Args:
            image_bytes: Bytes da imagem
            confidence_threshold: Limite mínimo de confiança
            
        Returns:
            Dicionário com a classificação ou None se não detectar
        """
        print(f"  [YOLO] Iniciando classificação...")
        print(f"  [YOLO] Threshold: {confidence_threshold}")
        
        if self.model is None:
            print(f"  [YOLO] ❌ ERRO: Modelo não carregado!")
            raise RuntimeError("Modelo não carregado")
        
        # Pré-processar imagem
        print(f"  [YOLO] Pré-processando imagem ({len(image_bytes)} bytes)...")
        image = self.preprocess_image(image_bytes)
        print(f"  [YOLO] Imagem pré-processada: {image.size}, mode={image.mode}")
        
        # Executar inferência
        print(f"  [YOLO] Executando inferência...")
        results = self.model(image, imgsz=640)
        print(f"  [YOLO] Inferência concluída. Resultados: {len(results)}")
        
        # Processar resultados
        all_detections = []
        best_detection = None
        best_confidence = 0.0
        
        print(f"  [YOLO] Processando resultados...")
        for idx, result in enumerate(results):
            boxes = result.boxes
            print(f"  [YOLO] Resultado {idx}: {len(boxes)} boxes detectadas")
            
            for box_idx, box in enumerate(boxes):
                class_id = int(box.cls)
                confidence = float(box.conf)
                
                # Obter tipo de cabelo
                hair_type = self.HAIR_TYPES.get(class_id, "Desconhecido")
                print(f"  [YOLO]   Box {box_idx}: class_id={class_id}, hair_type={hair_type}, conf={confidence:.4f}")
                
                # Obter bounding box
                bbox = box.xyxy[0].tolist() if box.xyxy is not None else None
                
                detection = {
                    "curvature": hair_type,
                    "confidence": round(confidence, 4),
                    "bbox": bbox
                }
                
                # Filtrar por confiança
                if confidence >= confidence_threshold:
                    all_detections.append(detection)
                    print(f"  [YOLO]   ✓ Detecção aceita (conf >= threshold)")
                    
                    # Guardar a melhor detecção
                    if confidence > best_confidence:
                        best_confidence = confidence
                        best_detection = detection
                else:
                    print(f"  [YOLO]   ✗ Detecção rejeitada (conf < threshold)")
        
        print(f"  [YOLO] Total detecções aceitas: {len(all_detections)}")
        print(f"  [YOLO] Melhor detecção: {best_detection}")
        
        if best_detection is None:
            print(f"  [YOLO] ⚠️ Nenhuma detecção acima do threshold")
            return None
        
        return {
            "curvature": best_detection["curvature"],
            "confidence": best_detection["confidence"],
            "all_detections": all_detections
        }
    
    def get_model_info(self) -> Dict[str, Any]:
        """Retorna informações sobre o modelo carregado"""
        if self.model is None:
            return {"status": "not_loaded"}
        
        return {
            "status": "loaded",
            "model_path": self.model_path,
            "classes": list(self.HAIR_TYPES.values()),
            "num_classes": len(self.HAIR_TYPES)
        }
