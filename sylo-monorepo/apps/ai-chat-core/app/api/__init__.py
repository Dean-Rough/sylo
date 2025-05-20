from fastapi import APIRouter
from app.api.v1 import router as v1_router

# Create a router for all API endpoints
router = APIRouter()

# Include all version routers
router.include_router(v1_router)