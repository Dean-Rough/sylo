import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import API routers
from app.api import router as api_router
from app.core.config import settings

# Create FastAPI application
app = FastAPI(
    title="AI Chat Core Service",
    description="AI-powered chat service with OpenAI integration and persistent memory",
    version="0.1.0",
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
        "version": "0.1.0"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include API routers
app.include_router(api_router)