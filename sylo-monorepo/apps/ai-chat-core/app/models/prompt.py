from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from app.core.config import settings


class PromptImproveRequest(BaseModel):
    """
    Request model for improving a prompt.
    """
    prompt_text: str = Field(..., description="The original prompt text to improve")
    user_id: UUID = Field(..., description="The ID of the user making the request")
    prompt_id: Optional[UUID] = Field(None, description="The ID of the prompt if it exists in the repository")
    model: Optional[str] = Field(None, description="The model to use for improvement (defaults to system default)")


class PromptImproveResponse(BaseModel):
    """
    Response model for improved prompt.
    """
    original_prompt: str = Field(..., description="The original prompt text")
    improved_prompt: str = Field(..., description="The improved prompt text")
    explanation: Optional[str] = Field(None, description="Explanation of the improvements made")
    success: bool = Field(..., description="Whether the improvement was successful")
    error: Optional[str] = Field(None, description="Error message if improvement failed")


class PromptCategorizeRequest(BaseModel):
    """
    Request model for categorizing a prompt.
    """
    prompt_text: str = Field(..., description="The prompt text to categorize")
    user_id: UUID = Field(..., description="The ID of the user making the request")
    prompt_id: Optional[UUID] = Field(None, description="The ID of the prompt if it exists in the repository")
    model: Optional[str] = Field(None, description="The model to use for categorization (defaults to system default)")


class PromptCategorizeResponse(BaseModel):
    """
    Response model for prompt categorization.
    """
    prompt_text: str = Field(..., description="The prompt text that was categorized")
    suggested_categories: List[str] = Field(..., description="List of suggested categories")
    confidence_scores: Optional[Dict[str, float]] = Field(None, description="Confidence scores for each category")
    success: bool = Field(..., description="Whether the categorization was successful")
    error: Optional[str] = Field(None, description="Error message if categorization failed")