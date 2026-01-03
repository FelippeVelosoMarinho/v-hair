import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests

from classifier.routers import classifier_router
from hair.routers import hair_router

load_dotenv()

app = FastAPI(
    title="Zohan Virtual API",
    description="API para classificação de curvatura capilar e recomendações de tratamentos",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS - permite localhost para desenvolvimento
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    os.getenv("VITE_APP_URL", ""),
]
# Remove strings vazias
allowed_origins = [origin for origin in allowed_origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai_key = os.getenv("OPENAI_KEY")

# criar requisição
headers = {"Authorization":  f"Bearer {openai_key}"}
link = "https://api.openai.com/v1/models"
requisicao = requests.get(link, headers=headers)

@app.get("/")
def hello() -> str:
    return "🧑‍🦱 Zohan Virtual API - Use /docs para ver a documentação"

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "1.0.0"}

# Routers
app.include_router(classifier_router.router)
app.include_router(hair_router.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)