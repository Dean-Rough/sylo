import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import API routers
from app.api import router as api_router
from app.core.config import settings

# Import model services to ensure they are initialized
from app.services.model_service import model_orchestrator
from app.services.openai_service import openai_service
# Anthropic service is conditionally imported in its module if API key is available
import app.services.anthropic_service

# Create FastAPI application
app = FastAPI(
    title="AI Chat Core Service",
    description="AI-powered chat service with multi-model orchestration and persistent memory",
    version="0.2.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def read_root():
    return {
        "message": "Welcome to the AI Chat Core Service!",
        "docs_url": "/docs",
        "version": "0.2.0"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    # Get available models from the orchestrator
    available_models = model_orchestrator.get_available_models()
    model_names = [model["id"] for model in available_models]
    
    return {
        "status": "healthy",
        "available_models": model_names,
        "default_model": settings.default_model,
        "multi_model_enabled": settings.enable_multi_model
    }

# Include API routers
app.include_router(api_router)