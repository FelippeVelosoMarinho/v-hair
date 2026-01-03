# 🎯 PLANNER - Zohan Virtual: Hair Consultor API

## 📋 Visão Geral do Projeto

Transformar o **Hair_Consultor** (notebook YOLO para classificação de curvatura capilar) em uma **API completa** com:
- Classificação de cabelo via imagem
- Catálogo de produtos via web scraping
- Banco de dados para consultas
- Agente inteligente (Mastra) para recomendações
- Futuro: Visagismo e tratamentos para alopecia

---

## 🏗️ Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
│                    - Upload de imagem                            │
│                    - Chat com agente                             │
│                    - Catálogo de produtos                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API (FastAPI)                            │
├─────────────────────────────────────────────────────────────────┤
│  /hair          │  /products      │  /agent        │  /user     │
│  - classify     │  - catalog      │  - chat        │  - prefs   │
│  - curvature    │  - search       │  - recommend   │  - history │
│  - analyze      │  - scrape       │  - schedule    │            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SERVICES                                 │
├─────────────────────────────────────────────────────────────────┤
│  YOLOv8         │  Scraper       │  Mastra Agent  │  BERTimbau  │
│  (Classificação)│  (Produtos)    │  (Cabeleireiro)│  (NLP)      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE (PostgreSQL)                      │
├─────────────────────────────────────────────────────────────────┤
│  users    │  products  │  curvatures  │  treatments  │  history │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Fases de Desenvolvimento

### 🔵 FASE 1: API de Classificação de Cabelo (MVP)
**Prioridade:** ALTA | **Estimativa:** 1-2 semanas

#### 1.1 Estrutura de Rotas - Hair Classification
- [ ] **`POST /hair/classify`** - Recebe imagem e retorna curvatura
  - Input: `multipart/form-data` (imagem)
  - Output: `{ curvatura: "3A", confiança: 0.95, detalhes: {...} }`
  
- [ ] **`GET /hair/curvatures`** - Lista todas as curvaturas e descrições
  - Output: `[{ id: "1", nome: "Liso", descrição: "..." }, ...]`

- [ ] **`GET /hair/curvature/{tipo}`** - Detalhes de uma curvatura específica
  - Output: `{ tipo: "3A", características: [...], cuidados: [...] }`

#### 1.2 Tarefas Técnicas
```
📁 api/
├── hair/
│   ├── __init__.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── hair_router.py          # Endpoints
│   │   └── hair_models.py          # Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── yolo_service.py         # Integração YOLOv8
│   │   ├── image_processor.py      # Pré-processamento
│   │   └── curvature_data.py       # Dados de curvaturas
│   └── models/
│       └── best.pt                 # Modelo treinado
```

#### 1.3 Checklist Fase 1
- [ ] Copiar `weights/best.pt` do treinamento YOLO para `api/hair/models/`
- [ ] Criar `yolo_service.py` com inferência do modelo
- [ ] Implementar `image_processor.py` para redimensionar imagens (640x640)
- [ ] Criar `hair_router.py` com rotas de classificação
- [ ] Adicionar `ultralytics` e `opencv-python` ao `requirements.txt`
- [ ] Testes unitários para classificação
- [ ] Documentação OpenAPI (Swagger)

---

### 🟢 FASE 2: Banco de Dados e Catálogo de Produtos
**Prioridade:** ALTA | **Estimativa:** 2-3 semanas

#### 2.1 Modelagem do Banco de Dados (PostgreSQL)

```sql
-- Tabela de Curvaturas
CREATE TABLE curvatures (
    id VARCHAR(3) PRIMARY KEY,        -- "1", "2A", "3B", etc.
    name VARCHAR(50),                  -- "Liso", "Ondulado A", etc.
    description TEXT,
    characteristics TEXT[],
    care_tips TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Produtos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    category VARCHAR(50),              -- "hidratacao", "nutricao", "reconstrucao", "finalizacao"
    price DECIMAL(10,2),
    price_range VARCHAR(20),           -- "acessivel", "medio", "premium"
    link TEXT,
    image_url TEXT,
    curvatures VARCHAR(3)[],           -- ["2A", "2B", "2C", "3A"]
    rating DECIMAL(2,1),
    reviews_count INTEGER,
    source VARCHAR(50),                -- "beleza_na_web", "sephora", "amazon"
    scraped_at TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(100),
    curvature VARCHAR(3),
    preferences JSONB,                 -- { marcas_favoritas: [], faixa_preco: "medio", alergias: [] }
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Histórico de Consultas
CREATE TABLE consultation_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    curvature_detected VARCHAR(3),
    confidence DECIMAL(3,2),
    image_path TEXT,
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Tratamentos (Cronograma Capilar)
CREATE TABLE treatments (
    id SERIAL PRIMARY KEY,
    curvature VARCHAR(3),
    treatment_type VARCHAR(50),        -- "hidratacao", "nutricao", "reconstrucao"
    frequency VARCHAR(50),             -- "semanal", "quinzenal", "mensal"
    instructions TEXT,
    recommended_products INTEGER[]
);
```

#### 2.2 Web Scraping de Produtos

**Sites alvo:**
- Beleza na Web
- Sephora Brasil
- Amazon Brasil
- Época Cosméticos
- Droga Raia

**Estrutura:**
```
📁 api/
├── scraper/
│   ├── __init__.py
│   ├── routers/
│   │   ├── scraper_router.py         # Endpoints admin
│   │   └── scraper_models.py
│   ├── services/
│   │   ├── base_scraper.py           # Classe base
│   │   ├── belezanaweb_scraper.py
│   │   ├── sephora_scraper.py
│   │   ├── amazon_scraper.py
│   │   └── product_normalizer.py     # Normaliza dados
│   └── tasks/
│       └── scraping_scheduler.py     # Jobs periódicos
```

#### 2.3 Rotas de Produtos
- [ ] **`GET /products`** - Lista produtos com filtros
  - Query params: `curvatura`, `categoria`, `preco_min`, `preco_max`, `marca`
  
- [ ] **`GET /products/{id}`** - Detalhes de um produto
  
- [ ] **`GET /products/recommendations/{curvatura}`** - Produtos recomendados
  - Query params: `faixa_preco`, `categoria`

- [ ] **`POST /admin/scrape`** - Trigger manual de scraping (admin)
  
- [ ] **`GET /admin/scrape/status`** - Status do último scraping

#### 2.4 Checklist Fase 2
- [ ] Configurar PostgreSQL (local e Railway)
- [ ] Criar migrations com Alembic
- [ ] Implementar scrapers para cada site
- [ ] Criar job de scraping periódico (Celery/APScheduler)
- [ ] Normalizar produtos para formato único
- [ ] Classificar produtos por curvatura (usando IA ou keywords)
- [ ] Endpoints de produtos com paginação e filtros
- [ ] Cache com Redis para consultas frequentes
- [ ] Testes de integração

---

### 🟡 FASE 3: Agente Inteligente (Mastra)
**Prioridade:** MÉDIA | **Estimativa:** 3-4 semanas

#### 3.1 Arquitetura do Agente

```
┌─────────────────────────────────────────────────────────────────┐
│                      MASTRA AGENT                                │
├─────────────────────────────────────────────────────────────────┤
│  TOOLS:                                                          │
│  - classify_hair(image) → curvatura                             │
│  - search_products(filters) → produtos                          │
│  - get_treatment_schedule(curvatura) → cronograma               │
│  - get_user_preferences(user_id) → preferências                 │
│                                                                  │
│  KNOWLEDGE BASE:                                                 │
│  - Curvaturas e características                                  │
│  - Cronogramas capilares                                         │
│  - Técnicas de cuidado                                           │
│  - FAQ sobre cabelos                                             │
│                                                                  │
│  PERSONALITY:                                                    │
│  - Cabeleireiro profissional                                     │
│  - Brasileiro, amigável                                          │
│  - Conhecedor de produtos nacionais                              │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.2 Estrutura
```
📁 api/
├── agent/
│   ├── __init__.py
│   ├── routers/
│   │   ├── agent_router.py           # Endpoints de chat
│   │   └── agent_models.py
│   ├── services/
│   │   ├── mastra_agent.py           # Configuração Mastra
│   │   ├── tools/
│   │   │   ├── hair_tool.py
│   │   │   ├── products_tool.py
│   │   │   └── treatment_tool.py
│   │   └── knowledge/
│   │       ├── curvatures.md
│   │       ├── treatments.md
│   │       └── faq.md
│   └── prompts/
│       └── system_prompt.txt
```

#### 3.3 Rotas do Agente
- [ ] **`POST /agent/chat`** - Conversa com o agente
  - Input: `{ message: "...", user_id?: "...", session_id?: "...", image?: File }`
  - Output: `{ response: "...", products?: [...], treatment?: {...} }`

- [ ] **`GET /agent/sessions/{user_id}`** - Histórico de sessões

- [ ] **`POST /agent/analyze`** - Análise completa com imagem
  - Combina classificação + recomendações em uma resposta

#### 3.4 Checklist Fase 3
- [ ] Configurar Mastra no projeto
- [ ] Implementar tools para o agente
- [ ] Criar knowledge base em Markdown
- [ ] Definir prompt de sistema
- [ ] Implementar memória de conversação
- [ ] Integrar com banco de dados de produtos
- [ ] Testes de conversação
- [ ] Fine-tuning com dados específicos (opcional)

---

### 🟠 FASE 4: Preferências de Usuário
**Prioridade:** MÉDIA | **Estimativa:** 1-2 semanas

#### 4.1 Rotas de Usuário
- [ ] **`POST /users`** - Criar usuário
- [ ] **`GET /users/{id}`** - Obter perfil
- [ ] **`PUT /users/{id}/preferences`** - Atualizar preferências
- [ ] **`GET /users/{id}/history`** - Histórico de consultas
- [ ] **`POST /users/{id}/favorites`** - Adicionar produto favorito

#### 4.2 Preferências Suportadas
```json
{
  "faixa_preco": "acessivel" | "medio" | "premium",
  "marcas_favoritas": ["Lola", "Salon Line", "Inoar"],
  "marcas_evitadas": [],
  "alergias": ["sulfato", "parabeno"],
  "tipo_cabelo": "natural" | "colorido" | "descolorido",
  "objetivos": ["hidratacao", "definicao", "volume"],
  "frequencia_lavagem": "diaria" | "alternada" | "low_poo"
}
```

---

### 🔴 FASE 5: Futuro - Visagismo e Alopecia
**Prioridade:** BAIXA | **Estimativa:** 4-6 semanas

#### 5.1 Visagismo
- [ ] Detectar formato do rosto via IA
- [ ] Recomendar cortes e penteados
- [ ] Simulação visual de cortes
- [ ] Integração com salões parceiros

#### 5.2 Alopecia
- [ ] Identificar áreas de perda capilar
- [ ] Classificar tipos de alopecia
- [ ] Recomendar tratamentos
- [ ] Parcerias com dermatologistas
- [ ] Disclaimer médico obrigatório

---

## 📁 Estrutura Final do Projeto

```
📁 ZohanVirtual/
├── api/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── requirements.txt
│   ├── docker-compose.yml
│   ├── Dockerfile
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── dependencies.py
│   │   ├── security.py
│   │   └── exceptions.py
│   │
│   ├── hair/
│   │   ├── __init__.py
│   │   ├── routers/
│   │   ├── services/
│   │   └── models/
│   │
│   ├── products/
│   │   ├── __init__.py
│   │   ├── routers/
│   │   ├── services/
│   │   └── schemas/
│   │
│   ├── scraper/
│   │   ├── __init__.py
│   │   ├── services/
│   │   └── tasks/
│   │
│   ├── agent/
│   │   ├── __init__.py
│   │   ├── routers/
│   │   ├── services/
│   │   ├── tools/
│   │   └── knowledge/
│   │
│   ├── users/
│   │   ├── __init__.py
│   │   ├── routers/
│   │   ├── services/
│   │   └── schemas/
│   │
│   ├── db/
│   │   ├── models/
│   │   └── migrations/
│   │
│   └── tests/
│       ├── test_hair.py
│       ├── test_products.py
│       ├── test_agent.py
│       └── test_users.py
│
├── client/
│   └── (Next.js frontend)
│
├── YOLO/
│   └── (Treinamento do modelo)
│
└── docker-compose.yml (orquestração completa)
```

---

## 🛠️ Stack Tecnológica

| Componente | Tecnologia |
|------------|------------|
| API | FastAPI + Uvicorn |
| Database | PostgreSQL + SQLAlchemy |
| Cache | Redis |
| ML - Visão | YOLOv8 (ultralytics) |
| ML - NLP | BERTimbau / GPT |
| Agente | Mastra |
| Scraping | BeautifulSoup + Playwright |
| Jobs | APScheduler / Celery |
| Deploy | Railway / Docker |
| Frontend | Next.js + TypeScript |

---

## 📅 Cronograma Sugerido

| Semana | Fase | Entregáveis |
|--------|------|-------------|
| 1-2 | Fase 1 | API de classificação funcionando |
| 3-4 | Fase 2.1 | Banco de dados configurado |
| 5-6 | Fase 2.2 | Scrapers implementados |
| 7-8 | Fase 2.3 | Catálogo de produtos completo |
| 9-10 | Fase 3.1 | Agente básico funcionando |
| 11-12 | Fase 3.2 | Agente com todas as tools |
| 13-14 | Fase 4 | Sistema de usuários |
| 15+ | Fase 5 | Visagismo e Alopecia |

---

## 🚀 Próximos Passos Imediatos

### Para começar HOJE:

1. **Copiar o modelo treinado:**
   ```bash
   cp YOLO/runs/detect/train/weights/best.pt api/hair/models/
   ```

2. **Atualizar requirements.txt:**
   ```
   ultralytics>=8.0.0
   opencv-python-headless>=4.8.0
   Pillow>=10.0.0
   ```

3. **Criar estrutura de pastas:**
   ```bash
   mkdir -p api/hair/{routers,services,models}
   mkdir -p api/products/{routers,services,schemas}
   mkdir -p api/db/{models,migrations}
   ```

4. **Implementar primeiro endpoint:**
   - `POST /hair/classify`

---

## 📝 Notas Importantes

### Sobre o Modelo YOLO
- O modelo atual está treinado com 10 classes (1, 2A-2C, 3A-3C, 4A-4C)
- Imagens devem ser redimensionadas para 640x640
- Considerar data augmentation para melhorar precisão

### Sobre Web Scraping
- Respeitar robots.txt dos sites
- Implementar rate limiting
- Armazenar dados localmente para não sobrecarregar
- Atualizar preços periodicamente (diário/semanal)

### Sobre o Agente
- Mastra permite criar agentes com tools customizados
- Considerar streaming para respostas longas
- Implementar fallbacks para quando a IA não souber responder

### Considerações Legais
- Disclaimer para recomendações de saúde (alopecia)
- Termos de uso para coleta de imagens
- LGPD para dados de usuários

---

## ✅ Validação do Plano

Antes de começar cada fase, valide:
- [ ] Escopo está claro?
- [ ] Dependências identificadas?
- [ ] Testes definidos?
- [ ] Critérios de aceite estabelecidos?

---

*Documento criado em: 03/01/2026*
*Última atualização: 03/01/2026*
*Versão: 1.0*
