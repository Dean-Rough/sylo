from typing import Optional, Dict, Any
from uuid import UUID, uuid4
from datetime import datetime
from app.db.supabase_client import supabase, supabase_admin
from app.models.user import UserSettings, UserSettingsUpdateRequest


class UserSettingsRepository:
    """
    Repository for managing user settings in Supabase.
    """
    
    def __init__(self):
        self.table_name = "user_settings"
    
    async def get_settings(self, user_id: UUID) -> Optional[UserSettings]:
        """
        Get settings for a specific user.
        
        Args:
            user_id: The ID of the user.
            
        Returns:
            The user's settings or None if not found.
        """
        # Query Supabase
        response = (
            supabase.table(self.table_name)
            .select("*")
            .eq("user_id", str(user_id))
            .limit(1)
            .execute()
        )
        
        if response.data and len(response.data) > 0:
            # Convert to UserSettings object
            return UserSettings(**response.data[0])
        else:
            return None
    
    async def create_settings(self, settings: UserSettings) -> UserSettings:
        """
        Create new settings for a user.
        
        Args:
            settings: The settings to create.
            
        Returns:
            The created settings with ID.
        """
        # Generate UUID if not provided
        if not settings.id:
            settings.id = uuid4()
            
        # Set timestamps if not provided
        now = datetime.now()
        if not settings.created_at:
            settings.created_at = now
        if not settings.updated_at:
            settings.updated_at = now
            
        # Convert to dict for Supabase
        settings_dict = settings.dict()
        
        # Convert datetime to ISO format string for Supabase
        settings_dict["created_at"] = settings_dict["created_at"].isoformat()
        settings_dict["updated_at"] = settings_dict["updated_at"].isoformat()
        
        # Insert into Supabase
        response = supabase_admin.table(self.table_name).insert(settings_dict).execute()
        
        if response.data:
            # Update the settings with the returned data
            return UserSettings(**response.data[0])
        else:
            # If no data returned, return the original settings
            return settings
    
    async def update_settings(
        self, 
        user_id: UUID, 
        update_data: UserSettingsUpdateRequest
    ) -> Optional[UserSettings]:
        """
        Update settings for a user.
        
        Args:
            user_id: The ID of the user.
            update_data: The settings data to update.
            
        Returns:
            The updated settings or None if not found.
        """
        # Get current settings
        current_settings = await self.get_settings(user_id)
        
        if not current_settings:
            # If no settings exist, create default settings with the update data
            default_settings = UserSettings(
                user_id=user_id,
                default_model="gpt-4o",
                temperature=0.7,
                memory_window=10
            )
            
            # Apply updates
            update_dict = update_data.dict(exclude_unset=True, exclude={"user_id"})
            for key, value in update_dict.items():
                setattr(default_settings, key, value)
                
            # Create new settings
            return await self.create_settings(default_settings)
        
        # Prepare update data
        update_dict = update_data.dict(exclude_unset=True, exclude={"user_id"})
        update_dict["updated_at"] = datetime.now().isoformat()
        
        # Update in Supabase
        response = (
            supabase_admin.table(self.table_name)
            .update(update_dict)
            .eq("user_id", str(user_id))
            .execute()
        )
        
        if response.data and len(response.data) > 0:
            # Convert to UserSettings object
            return UserSettings(**response.data[0])
        else:
            return None
    
    async def get_or_create_settings(self, user_id: UUID) -> UserSettings:
        """
        Get settings for a user or create default settings if none exist.
        
        Args:
            user_id: The ID of the user.
            
        Returns:
            The user's settings.
        """
        # Try to get existing settings
        settings = await self.get_settings(user_id)
        
        if settings:
            return settings
        
        # Create default settings
        default_settings = UserSettings(
            user_id=user_id,
            default_model="gpt-4o",
            temperature=0.7,
            memory_window=10
        )
        
        # Create in database
        return await self.create_settings(default_settings)


# Create a global instance
user_settings_repository = UserSettingsRepository()