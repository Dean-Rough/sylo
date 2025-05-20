from typing import Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Header
from app.models.user import UserSettingsResponse, UserSettingsUpdateRequest
from app.crud.crud_user_settings import user_settings_repository

router = APIRouter(prefix="/user-settings", tags=["user_settings"])


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


@router.get("", response_model=UserSettingsResponse)
async def get_settings(
    user_id: UUID = Depends(get_user_id)
) -> UserSettingsResponse:
    """
    Get settings for the authenticated user.
    
    Args:
        user_id: The ID of the user making the request.
        
    Returns:
        The user's settings.
    """
    try:
        # Get or create settings
        settings = await user_settings_repository.get_or_create_settings(user_id)
        
        return UserSettingsResponse(
            settings=settings,
            success=True
        )
    except Exception as e:
        return UserSettingsResponse(
            settings=None,
            success=False,
            error=str(e)
        )


@router.put("", response_model=UserSettingsResponse)
async def update_settings(
    update_request: UserSettingsUpdateRequest,
    user_id: UUID = Depends(get_user_id)
) -> UserSettingsResponse:
    """
    Update settings for the authenticated user.
    
    Args:
        update_request: The settings update request.
        user_id: The ID of the user making the request.
        
    Returns:
        The updated user settings.
    """
    try:
        # Override user_id from the header (security measure)
        update_request.user_id = user_id
        
        # Update settings
        updated_settings = await user_settings_repository.update_settings(
            user_id=user_id,
            update_data=update_request
        )
        
        if not updated_settings:
            # This should not happen since we use get_or_create_settings
            raise HTTPException(status_code=404, detail="Settings not found")
        
        return UserSettingsResponse(
            settings=updated_settings,
            success=True
        )
    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise e
    except Exception as e:
        return UserSettingsResponse(
            settings=None,
            success=False,
            error=str(e)
        )