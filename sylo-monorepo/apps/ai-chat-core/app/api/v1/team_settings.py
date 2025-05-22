from fastapi import APIRouter, HTTPException, Depends
from typing import List
from uuid import UUID

from app.models.team import (
    TeamSettings,
    TeamSettingsRequest,
    TeamSettingsUpdateRequest,
    TeamSettingsResponse,
    Team
)
from app.crud.crud_team_settings import (
    get_team_settings,
    create_team_settings,
    update_team_settings,
    delete_team_settings,
    get_teams_for_user
)

router = APIRouter()


@router.get("/teams", response_model=List[Team])
async def list_teams(user_id: UUID):
    """
    Get all teams for a user.
    """
    try:
        teams = await get_teams_for_user(user_id)
        return teams
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/teams/{team_id}/settings", response_model=TeamSettingsResponse)
async def get_settings(team_id: UUID):
    """
    Get settings for a specific team.
    """
    try:
        settings = await get_team_settings(team_id)
        if not settings:
            return TeamSettingsResponse(
                settings=TeamSettings(team_id=team_id),
                success=True
            )
        return TeamSettingsResponse(settings=settings, success=True)
    except Exception as e:
        return TeamSettingsResponse(
            settings=TeamSettings(team_id=team_id),
            success=False,
            error=str(e)
        )


@router.post("/teams/{team_id}/settings", response_model=TeamSettingsResponse)
async def create_settings(team_id: UUID, request: TeamSettingsUpdateRequest):
    """
    Create settings for a specific team.
    """
    try:
        # Ensure team_id in path matches request body
        if team_id != request.team_id:
            raise ValueError("Team ID in path must match Team ID in request body")
        
        settings = await create_team_settings(request)
        return TeamSettingsResponse(settings=settings, success=True)
    except Exception as e:
        return TeamSettingsResponse(
            settings=TeamSettings(team_id=team_id),
            success=False,
            error=str(e)
        )


@router.put("/teams/{team_id}/settings", response_model=TeamSettingsResponse)
async def update_settings(team_id: UUID, request: TeamSettingsUpdateRequest):
    """
    Update settings for a specific team.
    """
    try:
        # Ensure team_id in path matches request body
        if team_id != request.team_id:
            raise ValueError("Team ID in path must match Team ID in request body")
        
        settings = await update_team_settings(request)
        return TeamSettingsResponse(settings=settings, success=True)
    except Exception as e:
        return TeamSettingsResponse(
            settings=TeamSettings(team_id=team_id),
            success=False,
            error=str(e)
        )


@router.delete("/teams/{team_id}/settings", response_model=TeamSettingsResponse)
async def delete_settings(team_id: UUID):
    """
    Delete settings for a specific team.
    """
    try:
        success = await delete_team_settings(team_id)
        return TeamSettingsResponse(
            settings=TeamSettings(team_id=team_id),
            success=success
        )
    except Exception as e:
        return TeamSettingsResponse(
            settings=TeamSettings(team_id=team_id),
            success=False,
            error=str(e)
        )