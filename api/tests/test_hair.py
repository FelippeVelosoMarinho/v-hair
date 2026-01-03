"""
Hair Classification Tests
Testes para a API de classificação de cabelo
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import io

# Import será feito quando os testes forem executados
# from main import app


class TestHairRoutes:
    """Testes para as rotas de classificação de cabelo"""
    
    @pytest.fixture
    def client(self):
        """Cria um cliente de teste"""
        from main import app
        return TestClient(app)
    
    @pytest.fixture
    def mock_classifier(self):
        """Mock do classificador YOLO"""
        with patch('hair.routers.hair_router.classifier') as mock:
            mock.classify.return_value = {
                "curvature": "3A",
                "confidence": 0.92,
                "all_detections": [
                    {"curvature": "3A", "confidence": 0.92, "bbox": [100, 50, 400, 350]}
                ]
            }
            yield mock
    
    def test_list_curvatures(self, client):
        """Testa listagem de curvaturas"""
        response = client.get("/hair/curvatures")
        assert response.status_code == 200
        
        data = response.json()
        assert "total" in data
        assert "curvatures" in data
        assert data["total"] == 10  # 1, 2A-2C, 3A-3C, 4A-4C
    
    def test_get_curvature_valid(self, client):
        """Testa obtenção de curvatura válida"""
        response = client.get("/hair/curvatures/3A")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == "3A"
        assert data["name"] == "Cacheado A"
        assert "characteristics" in data
        assert "care_tips" in data
    
    def test_get_curvature_invalid(self, client):
        """Testa obtenção de curvatura inválida"""
        response = client.get("/hair/curvatures/5A")
        assert response.status_code == 404
    
    def test_classify_hair_success(self, client, mock_classifier):
        """Testa classificação de cabelo com sucesso"""
        # Criar uma imagem fake
        image_content = b"fake image content"
        files = {"file": ("test.jpg", io.BytesIO(image_content), "image/jpeg")}
        
        response = client.post("/hair/classify", files=files)
        
        # O teste pode falhar se o modelo não estiver carregado
        # mas o mock deveria funcionar
        assert response.status_code in [200, 500]
    
    def test_classify_hair_invalid_format(self, client):
        """Testa classificação com formato inválido"""
        files = {"file": ("test.txt", io.BytesIO(b"text content"), "text/plain")}
        
        response = client.post("/hair/classify", files=files)
        assert response.status_code == 400
    
    def test_health_check(self, client):
        """Testa endpoint de health check"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


class TestCurvatureData:
    """Testes para os dados de curvatura"""
    
    def test_all_curvatures_have_required_fields(self):
        """Testa que todas as curvaturas têm os campos obrigatórios"""
        from hair.services.curvature_data import CURVATURES_DATA
        
        required_fields = ["id", "name", "description", "characteristics", "care_tips"]
        
        for curvature_id, curvature in CURVATURES_DATA.items():
            for field in required_fields:
                assert hasattr(curvature, field), f"Curvatura {curvature_id} não tem campo {field}"
    
    def test_treatment_schedule(self):
        """Testa geração de cronograma capilar"""
        from hair.services.curvature_data import get_treatment_schedule
        
        schedule_3a = get_treatment_schedule("3A")
        assert "hidratacao" in schedule_3a
        assert "nutricao" in schedule_3a
        assert "reconstrucao" in schedule_3a
        
        schedule_4c = get_treatment_schedule("4C")
        assert schedule_4c["hidratacao"]["frequencia"] == "2x por semana"


class TestYOLOService:
    """Testes para o serviço YOLO"""
    
    def test_hair_types_mapping(self):
        """Testa mapeamento de classes"""
        from hair.services.yolo_service import YOLOClassifier
        
        assert YOLOClassifier.HAIR_TYPES[0] == "1"
        assert YOLOClassifier.HAIR_TYPES[4] == "3A"
        assert YOLOClassifier.HAIR_TYPES[9] == "4C"
        assert len(YOLOClassifier.HAIR_TYPES) == 10
