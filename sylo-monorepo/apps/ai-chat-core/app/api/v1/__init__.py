from fastapi import APIRouter
from app.api.v1.chat import router as chat_router
from app.api.v1.user_settings import router as user_settings_router
from app.api.v1.prompts import router as prompts_router
from app.api.v1.team_settings import router as team_settings_router

# Create a router for all v1 API endpoints
router = APIRouter(prefix="/v1")

# Include all routers
router.include_router(chat_router)
router.include_router(user_settings_router)
router.include_router(prompts_router)
router.include_router(team_settings_router)