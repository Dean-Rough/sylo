from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID


class TeamSettings(BaseModel):
    """
    Model for team-specific AI settings.
    """
    id: Optional[UUID] = Field(None, description="The ID of this team settings entry")
    team_id: UUID = Field(..., description="The ID of the team")
    default_model: str = Field("gpt-4o", description="The default AI model to use")
    temperature: float = Field(0.7, description="Default temperature setting (0-1)")
    max_tokens: Optional[int] = Field(None, description="Default maximum tokens to generate")
    memory_window: int = Field(10, description="Number of previous messages to include in context")
    created_at: Optional[datetime] = Field(None, description="When these settings were created")
    updated_at: Optional[datetime] = Field(None, description="When these settings were last updated")
    preferred_models: Optional[List[str]] = Field(None, description="List of preferred models in order of preference")
    model_specific_settings: Optional[Dict[str, Dict[str, Any]]] = Field(None, description="Settings specific to each model")
    preferences: Optional[Dict[str, Any]] = Field(None, description="Additional team preferences")
    enforce_team_settings: bool = Field(False, description="Whether to enforce team settings for all team members")


class TeamSettingsRequest(BaseModel):
    """
    Request model for getting or updating team settings.
    """
    team_id: UUID = Field(..., description="The ID of the team")


class TeamSettingsUpdateRequest(BaseModel):
    """
    Request model for updating team settings.
    """
    team_id: UUID = Field(..., description="The ID of the team")
    default_model: Optional[str] = Field(None, description="The default AI model to use")
    temperature: Optional[float] = Field(None, description="Default temperature setting (0-1)")
    max_tokens: Optional[int] = Field(None, description="Default maximum tokens to generate")
    memory_window: Optional[int] = Field(None, description="Number of previous messages to include in context")
    preferred_models: Optional[List[str]] = Field(None, description="List of preferred models in order of preference")
    model_specific_settings: Optional[Dict[str, Dict[str, Any]]] = Field(None, description="Settings specific to each model")
    preferences: Optional[Dict[str, Any]] = Field(None, description="Additional team preferences")
    enforce_team_settings: Optional[bool] = Field(None, description="Whether to enforce team settings for all team members")


class TeamSettingsResponse(BaseModel):
    """
    Response model for team settings.
    """
    settings: TeamSettings = Field(..., description="The team's settings")
    success: bool = Field(..., description="Whether the operation was successful")
    error: Optional[str] = Field(None, description="Error message if operation failed")


class Team(BaseModel):
    """
    Model for team information.
    """
    id: UUID = Field(..., description="The ID of the team")
    name: str = Field(..., description="The name of the team")
    description: Optional[str] = Field(None, description="The description of the team")
    created_at: Optional[datetime] = Field(None, description="When the team was created")
    updated_at: Optional[datetime] = Field(None, description="When the team was last updated")
    owner_id: UUID = Field(..., description="The ID of the team owner")
    members: Optional[List[UUID]] = Field(None, description="List of team member user IDs")