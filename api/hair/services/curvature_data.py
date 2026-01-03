"""
Curvature Data
Dados estáticos sobre os tipos de curvatura capilar
"""
from typing import Dict
from ..routers.hair_models import CurvatureInfo


CURVATURES_DATA: Dict[str, CurvatureInfo] = {
    "1": CurvatureInfo(
        id="1",
        name="Liso",
        description="Cabelo completamente liso, sem ondulações ou curvas. Os fios são retos da raiz às pontas.",
        characteristics=[
            "Fios retos da raiz às pontas",
            "Textura geralmente fina ou média",
            "Tende a ser oleoso mais rapidamente",
            "Brilho natural intenso",
            "Fácil de pentear"
        ],
        care_tips=[
            "Lavar com frequência para controlar oleosidade",
            "Usar shampoos leves e sem silicone pesado",
            "Evitar condicionador na raiz",
            "Hidratação quinzenal",
            "Usar protetor térmico antes de chapinha ou secador"
        ],
        porosity="baixa"
    ),
    
    "2A": CurvatureInfo(
        id="2A",
        name="Ondulado A",
        description="Ondas leves e sutis, quase imperceptíveis. O cabelo forma um 'S' suave.",
        characteristics=[
            "Ondas suaves e soltas",
            "Forma de S leve",
            "Raiz geralmente lisa",
            "Ondas começam no meio do comprimento",
            "Textura fina a média"
        ],
        care_tips=[
            "Usar produtos leves para não pesar",
            "Técnica de amassamento para definir ondas",
            "Evitar escovar seco",
            "Hidratação semanal",
            "Leave-in leve"
        ],
        porosity="baixa a média"
    ),
    
    "2B": CurvatureInfo(
        id="2B",
        name="Ondulado B",
        description="Ondas mais definidas em formato de S. Mais volume que o 2A.",
        characteristics=[
            "Ondas bem visíveis em forma de S",
            "Mais volume na raiz",
            "Tendência a frizz",
            "Textura média",
            "Ondas ao longo de todo comprimento"
        ],
        care_tips=[
            "Co-wash ou low poo",
            "Gel ou mousse para definição",
            "Difusor em temperatura baixa",
            "Hidratação e nutrição alternadas",
            "Fronha de cetim para evitar frizz"
        ],
        porosity="média"
    ),
    
    "2C": CurvatureInfo(
        id="2C",
        name="Ondulado C",
        description="Ondas intensas que começam a formar cachos. Transição entre ondulado e cacheado.",
        characteristics=[
            "Ondas bem definidas, quase cachos",
            "Volume expressivo",
            "Alto frizz",
            "Textura média a grossa",
            "Pode ter cachos misturados"
        ],
        care_tips=[
            "Cronograma capilar completo",
            "Técnica de fitagem ou dedoliss",
            "Cremes de pentear médios",
            "Evitar sulfatos e parabenos",
            "Finalização com gel ou gelatina"
        ],
        porosity="média a alta"
    ),
    
    "3A": CurvatureInfo(
        id="3A",
        name="Cacheado A",
        description="Cachos largos e soltos, bem definidos. Diâmetro aproximado de um giz de cera.",
        characteristics=[
            "Cachos em espiral soltos",
            "Diâmetro grande (como giz de cera)",
            "Brilho natural",
            "Volume moderado",
            "Cachos definidos naturalmente"
        ],
        care_tips=[
            "Hidratação semanal",
            "Nutrição quinzenal",
            "Ativador de cachos",
            "Não pentear seco",
            "Umectação com óleos leves"
        ],
        porosity="média"
    ),
    
    "3B": CurvatureInfo(
        id="3B",
        name="Cacheado B",
        description="Cachos médios e bem fechados. Diâmetro aproximado de um dedo indicador.",
        characteristics=[
            "Cachos bem fechados",
            "Diâmetro médio (como dedo)",
            "Alto volume",
            "Textura média a grossa",
            "Propenso a ressecamento"
        ],
        care_tips=[
            "Cronograma capilar rigoroso",
            "Hidratação 2x por semana",
            "Óleo de coco ou argan",
            "Creme de pentear cremoso",
            "Day after com água e leave-in"
        ],
        porosity="média a alta"
    ),
    
    "3C": CurvatureInfo(
        id="3C",
        name="Cacheado C",
        description="Cachos bem apertados e definidos. Diâmetro aproximado de um lápis.",
        characteristics=[
            "Cachos muito fechados",
            "Diâmetro pequeno (como lápis)",
            "Volume intenso",
            "Textura grossa",
            "Alta densidade"
        ],
        care_tips=[
            "Hidratação profunda semanal",
            "Nutrição 2x por semana",
            "Reconstrução mensal",
            "Cremes densos e manteigas",
            "Fitagem para definição"
        ],
        porosity="alta"
    ),
    
    "4A": CurvatureInfo(
        id="4A",
        name="Crespo A",
        description="Crespo com cachos em formato de mola apertada. Diâmetro de uma agulha de crochê.",
        characteristics=[
            "Cachos bem pequenos e definidos",
            "Formato de mola apertada",
            "Alto encolhimento (shrinkage)",
            "Textura fina a média",
            "Fios delicados"
        ],
        care_tips=[
            "Hidratação profunda 2x por semana",
            "Nutrição com óleos e manteigas",
            "Evitar manipulação excessiva",
            "Penteados protetivos",
            "Umectação noturna"
        ],
        porosity="alta"
    ),
    
    "4B": CurvatureInfo(
        id="4B",
        name="Crespo B",
        description="Crespo com formato de Z. Cachos menos definidos, mais angulares.",
        characteristics=[
            "Formato de Z ou zigue-zague",
            "Menos definição natural",
            "Alto encolhimento",
            "Textura média a grossa",
            "Muito frágil"
        ],
        care_tips=[
            "Hidratação intensa e frequente",
            "Nutrição com manteigas pesadas",
            "Reconstrução quinzenal",
            "Twist outs e braid outs",
            "Proteção noturna com touca de cetim"
        ],
        porosity="alta"
    ),
    
    "4C": CurvatureInfo(
        id="4C",
        name="Crespo C",
        description="Crespo mais fechado, com pouca ou nenhuma definição natural de cachos.",
        characteristics=[
            "Padrão de curvatura muito fechado",
            "Encolhimento extremo (até 75%)",
            "Pouca definição natural",
            "Textura grossa",
            "Extremamente frágil"
        ],
        care_tips=[
            "Hidratação diária com spray",
            "Nutrição profunda com manteigas (murumuru, karité)",
            "Reconstrução com queratina quinzenal",
            "Desembaraçar apenas molhado e com condicionador",
            "Penteados protetivos frequentes",
            "LOC/LCO method (Liquid, Oil, Cream)"
        ],
        porosity="alta"
    )
}


def get_treatment_schedule(curvature: str) -> dict:
    """
    Retorna um cronograma capilar recomendado para a curvatura.
    
    Args:
        curvature: Tipo de curvatura (1, 2A, 2B, etc.)
        
    Returns:
        Dicionário com o cronograma semanal
    """
    # Cronogramas base por grupo
    schedules = {
        "1": {
            "hidratacao": {"frequencia": "quinzenal", "duracao": "15-20min"},
            "nutricao": {"frequencia": "mensal", "duracao": "15min"},
            "reconstrucao": {"frequencia": "mensal", "duracao": "10min"}
        },
        "2": {
            "hidratacao": {"frequencia": "semanal", "duracao": "20min"},
            "nutricao": {"frequencia": "quinzenal", "duracao": "20min"},
            "reconstrucao": {"frequencia": "mensal", "duracao": "15min"}
        },
        "3": {
            "hidratacao": {"frequencia": "semanal", "duracao": "30min"},
            "nutricao": {"frequencia": "semanal", "duracao": "30min"},
            "reconstrucao": {"frequencia": "quinzenal", "duracao": "20min"}
        },
        "4": {
            "hidratacao": {"frequencia": "2x por semana", "duracao": "40min"},
            "nutricao": {"frequencia": "2x por semana", "duracao": "40min"},
            "reconstrucao": {"frequencia": "semanal", "duracao": "30min"}
        }
    }
    
    # Extrair grupo base (1, 2, 3 ou 4)
    base_group = curvature[0] if curvature else "1"
    
    return schedules.get(base_group, schedules["1"])
