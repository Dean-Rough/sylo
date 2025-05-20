from typing import Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Header
from app.models.prompt import (
    PromptImproveRequest, 
    PromptImproveResponse, 
    PromptCategorizeRequest, 
    PromptCategorizeResponse
)
from app.services.prompt_service import prompt_service

router = APIRouter(prefix="/prompts", tags=["prompts"])


async def get_user_id(x_user_id: str = Header(...)) -> UUID:
    """
    Extract and validate the user ID from the request header.
    
    Args:
        x_user_id: The user ID from the X-User-ID header.
        
    Returns:
        The validated UUID.
        
    Raises:
        HTTPException: If the user ID is invalid.
    """
    try:
        return UUID(x_user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format")


@router.post("/improve", response_model=PromptImproveResponse)
async def improve_prompt(
    request: PromptImproveRequest,
    user_id: UUID = Depends(get_user_id)
) -> PromptImproveResponse:
    """
    Improve a prompt using AI.
    
    Args:
        request: The prompt improvement request.
        user_id: The ID of the user making the request.
        
    Returns:
        The improved prompt response.
    """
    # Override user_id from the header (security measure)
    request.user_id = user_id
    
    # Call prompt service
    response = await prompt_service.improve_prompt(request)
    
    return response


@router.post("/categorize", response_model=PromptCategorizeResponse)
async def categorize_prompt(
    request: PromptCategorizeRequest,
    user_id: UUID = Depends(get_user_id)
) -> PromptCategorizeResponse:
    """
    Suggest categories for a prompt using AI.
    
    Args:
        request: The prompt categorization request.
        user_id: The ID of the user making the request.
        
    Returns:
        The categorization response with suggested categories.
    """
    # Override user_id from the header (security measure)
    request.user_id = user_id
    
    # Call prompt service
    response = await prompt_service.categorize_prompt(request)
    
    return response