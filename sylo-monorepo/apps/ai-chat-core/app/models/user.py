from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID


class UserSettings(BaseModel):
    """
    Model for user-specific AI settings.
    """
    id: Optional[UUID] = Field(None, description="The ID of this settings entry")
    user_id: UUID = Field(..., description="The ID of the user")
    default_model: str = Field("gpt-4o", description="The default OpenAI model to use")
    temperature: float = Field(0.7, description="Default temperature setting (0-1)")
    max_tokens: Optional[int] = Field(None, description="Default maximum tokens to generate")
    memory_window: int = Field(10, description="Number of previous messages to include in context")
    created_at: Optional[datetime] = Field(None, description="When these settings were created")
    updated_at: Optional[datetime] = Field(None, description="When these settings were last updated")
    preferences: Optional[Dict[str, Any]] = Field(None, description="Additional user preferences")


class UserSettingsRequest(BaseModel):
    """
    Request model for getting or updating user settings.
    """
    user_id: UUID = Field(..., description="The ID of the user")


class UserSettingsUpdateRequest(BaseModel):
    """
    Request model for updating user settings.
    """
    user_id: UUID = Field(..., description="The ID of the user")
    default_model: Optional[str] = Field(None, description="The default OpenAI model to use")
    temperature: Optional[float] = Field(None, description="Default temperature setting (0-1)")
    max_tokens: Optional[int] = Field(None, description="Default maximum tokens to generate")
    memory_window: Optional[int] = Field(None, description="Number of previous messages to include in context")
    preferences: Optional[Dict[str, Any]] = Field(None, description="Additional user preferences")


class UserSettingsResponse(BaseModel):
    """
    Response model for user settings.
    """
    settings: UserSettings = Field(..., description="The user's settings")
    success: bool = Field(..., description="Whether the operation was successful")
    error: Optional[str] = Field(None, description="Error message if operation failed")