from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.models.team import TeamSettings, TeamSettingsUpdateRequest, Team
from app.db.supabase_client import get_supabase_client


async def get_teams_for_user(user_id: UUID) -> List[Team]:
    """
    Get all teams that a user is a member of.
    """
    supabase = get_supabase_client()
    
    # First get teams where user is the owner
    owner_response = supabase.table("teams").select("*").eq("owner_id", str(user_id)).execute()
    
    # Then get teams where user is a member
    member_response = supabase.table("team_members").select("team_id").eq("user_id", str(user_id)).execute()
    
    team_ids = [member["team_id"] for member in member_response.data]
    
    # If user is a member of any teams, get those teams
    teams = owner_response.data
    if team_ids:
        member_teams_response = supabase.table("teams").select("*").in_("id", team_ids).execute()
        teams.extend(member_teams_response.data)
    
    # Convert to Team objects
    return [
        Team(
            id=UUID(team["id"]),
            name=team["name"],
            description=team.get("description"),
            created_at=datetime.fromisoformat(team["created_at"]) if team.get("created_at") else None,
            updated_at=datetime.fromisoformat(team["updated_at"]) if team.get("updated_at") else None,
            owner_id=UUID(team["owner_id"]),
            members=team.get("members")
        )
        for team in teams
    ]


async def get_team_settings(team_id: UUID) -> Optional[TeamSettings]:
    """
    Get settings for a specific team.
    """
    supabase = get_supabase_client()
    response = supabase.table("team_settings").select("*").eq("team_id", str(team_id)).execute()
    
    if not response.data:
        return None
    
    settings_data = response.data[0]
    
    return TeamSettings(
        id=UUID(settings_data["id"]),
        team_id=UUID(settings_data["team_id"]),
        default_model=settings_data.get("default_model", "gpt-4o"),
        temperature=settings_data.get("temperature", 0.7),
        max_tokens=settings_data.get("max_tokens"),
        memory_window=settings_data.get("memory_window", 10),
        created_at=datetime.fromisoformat(settings_data["created_at"]) if settings_data.get("created_at") else None,
        updated_at=datetime.fromisoformat(settings_data["updated_at"]) if settings_data.get("updated_at") else None,
        preferred_models=settings_data.get("preferred_models"),
        model_specific_settings=settings_data.get("model_specific_settings"),
        preferences=settings_data.get("preferences"),
        enforce_team_settings=settings_data.get("enforce_team_settings", False)
    )


async def create_team_settings(request: TeamSettingsUpdateRequest) -> TeamSettings:
    """
    Create settings for a specific team.
    """
    supabase = get_supabase_client()
    
    # Check if settings already exist
    existing = await get_team_settings(request.team_id)
    if existing:
        raise ValueError(f"Settings already exist for team {request.team_id}")
    
    # Prepare data for insertion
    now = datetime.utcnow().isoformat()
    settings_data = {
        "team_id": str(request.team_id),
        "created_at": now,
        "updated_at": now,
    }
    
    # Add optional fields if provided
    if request.default_model is not None:
        settings_data["default_model"] = request.default_model
    if request.temperature is not None:
        settings_data["temperature"] = request.temperature
    if request.max_tokens is not None:
        settings_data["max_tokens"] = request.max_tokens
    if request.memory_window is not None:
        settings_data["memory_window"] = request.memory_window
    if request.preferred_models is not None:
        settings_data["preferred_models"] = request.preferred_models
    if request.model_specific_settings is not None:
        settings_data["model_specific_settings"] = request.model_specific_settings
    if request.preferences is not None:
        settings_data["preferences"] = request.preferences
    if request.enforce_team_settings is not None:
        settings_data["enforce_team_settings"] = request.enforce_team_settings
    
    # Insert into database
    response = supabase.table("team_settings").insert(settings_data).execute()
    
    if not response.data:
        raise ValueError("Failed to create team settings")
    
    created_data = response.data[0]
    
    return TeamSettings(
        id=UUID(created_data["id"]),
        team_id=UUID(created_data["team_id"]),
        default_model=created_data.get("default_model", "gpt-4o"),
        temperature=created_data.get("temperature", 0.7),
        max_tokens=created_data.get("max_tokens"),
        memory_window=created_data.get("memory_window", 10),
        created_at=datetime.fromisoformat(created_data["created_at"]) if created_data.get("created_at") else None,
        updated_at=datetime.fromisoformat(created_data["updated_at"]) if created_data.get("updated_at") else None,
        preferred_models=created_data.get("preferred_models"),
        model_specific_settings=created_data.get("model_specific_settings"),
        preferences=created_data.get("preferences"),
        enforce_team_settings=created_data.get("enforce_team_settings", False)
    )


async def update_team_settings(request: TeamSettingsUpdateRequest) -> TeamSettings:
    """
    Update settings for a specific team.
    """
    supabase = get_supabase_client()
    
    # Check if settings exist
    existing = await get_team_settings(request.team_id)
    if not existing:
        return await create_team_settings(request)
    
    # Prepare data for update
    settings_data = {
        "updated_at": datetime.utcnow().isoformat(),
    }
    
    # Add optional fields if provided
    if request.default_model is not None:
        settings_data["default_model"] = request.default_model
    if request.temperature is not None:
        settings_data["temperature"] = request.temperature
    if request.max_tokens is not None:
        settings_data["max_tokens"] = request.max_tokens
    if request.memory_window is not None:
        settings_data["memory_window"] = request.memory_window
    if request.preferred_models is not None:
        settings_data["preferred_models"] = request.preferred_models
    if request.model_specific_settings is not None:
        settings_data["model_specific_settings"] = request.model_specific_settings
    if request.preferences is not None:
        settings_data["preferences"] = request.preferences
    if request.enforce_team_settings is not None:
        settings_data["enforce_team_settings"] = request.enforce_team_settings
    
    # Update in database
    response = supabase.table("team_settings").update(settings_data).eq("team_id", str(request.team_id)).execute()
    
    if not response.data:
        raise ValueError("Failed to update team settings")
    
    updated_data = response.data[0]
    
    return TeamSettings(
        id=UUID(updated_data["id"]),
        team_id=UUID(updated_data["team_id"]),
        default_model=updated_data.get("default_model", "gpt-4o"),
        temperature=updated_data.get("temperature", 0.7),
        max_tokens=updated_data.get("max_tokens"),
        memory_window=updated_data.get("memory_window", 10),
        created_at=datetime.fromisoformat(updated_data["created_at"]) if updated_data.get("created_at") else None,
        updated_at=datetime.fromisoformat(updated_data["updated_at"]) if updated_data.get("updated_at") else None,
        preferred_models=updated_data.get("preferred_models"),
        model_specific_settings=updated_data.get("model_specific_settings"),
        preferences=updated_data.get("preferences"),
        enforce_team_settings=updated_data.get("enforce_team_settings", False)
    )


async def delete_team_settings(team_id: UUID) -> bool:
    """
    Delete settings for a specific team.
    """
    supabase = get_supabase_client()
    
    # Delete from database
    response = supabase.table("team_settings").delete().eq("team_id", str(team_id)).execute()
    
    # Return success status
    return len(response.data) > 0