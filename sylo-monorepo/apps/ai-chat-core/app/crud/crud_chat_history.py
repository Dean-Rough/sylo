from typing import List, Optional, Dict, Any
from uuid import UUID, uuid4
from datetime import datetime
from app.db.supabase_client import supabase, supabase_admin
from app.models.chat import ChatHistoryEntry


class ChatHistoryRepository:
    """
    Repository for managing chat history in Supabase.
    """
    
    def __init__(self):
        self.table_name = "chat_history"
    
    async def create_entry(self, entry: ChatHistoryEntry) -> ChatHistoryEntry:
        """
        Create a new chat history entry.
        
        Args:
            entry: The chat history entry to create.
            
        Returns:
            The created chat history entry with ID.
        """
        # Generate UUID if not provided
        if not entry.id:
            entry.id = uuid4()
            
        # Set created_at if not provided
        if not entry.created_at:
            entry.created_at = datetime.now()
            
        # Convert to dict for Supabase
        entry_dict = entry.dict()
        
        # Convert datetime to ISO format string for Supabase
        entry_dict["created_at"] = entry_dict["created_at"].isoformat()
        
        # Insert into Supabase
        response = supabase_admin.table(self.table_name).insert(entry_dict).execute()
        
        if response.data:
            # Update the entry with the returned data
            return ChatHistoryEntry(**response.data[0])
        else:
            # If no data returned, return the original entry
            return entry
    
    async def get_session_history(
        self, 
        user_id: UUID, 
        session_id: UUID, 
        limit: int = 50,
        order: str = "asc"
    ) -> List[ChatHistoryEntry]:
        """
        Get chat history for a specific session.
        
        Args:
            user_id: The ID of the user.
            session_id: The ID of the session.
            limit: Maximum number of entries to return.
            order: Sort order ("asc" or "desc").
            
        Returns:
            List of chat history entries.
        """
        # Query Supabase
        query = (
            supabase.table(self.table_name)
            .select("*")
            .eq("user_id", str(user_id))
            .eq("session_id", str(session_id))
            .order("created_at", order)
            .limit(limit)
        )
        
        response = query.execute()
        
        if response.data:
            # Convert to ChatHistoryEntry objects
            return [ChatHistoryEntry(**entry) for entry in response.data]
        else:
            return []
    
    async def get_recent_history(
        self, 
        user_id: UUID, 
        limit: int = 10
    ) -> List[ChatHistoryEntry]:
        """
        Get recent chat history for a user across all sessions.
        
        Args:
            user_id: The ID of the user.
            limit: Maximum number of entries to return.
            
        Returns:
            List of chat history entries.
        """
        # Query Supabase
        query = (
            supabase.table(self.table_name)
            .select("*")
            .eq("user_id", str(user_id))
            .order("created_at", "desc")
            .limit(limit)
        )
        
        response = query.execute()
        
        if response.data:
            # Convert to ChatHistoryEntry objects
            return [ChatHistoryEntry(**entry) for entry in response.data]
        else:
            return []
    
    async def create_new_session(self, user_id: UUID) -> UUID:
        """
        Create a new chat session.
        
        Args:
            user_id: The ID of the user.
            
        Returns:
            The ID of the new session.
        """
        session_id = uuid4()
        
        # Create a system message to mark the start of the session
        entry = ChatHistoryEntry(
            user_id=user_id,
            session_id=session_id,
            role="system",
            content="Session started",
            metadata={"session_start": True}
        )
        
        await self.create_entry(entry)
        
        return session_id
    
    async def delete_session(self, user_id: UUID, session_id: UUID) -> bool:
        """
        Delete all chat history for a specific session.
        
        Args:
            user_id: The ID of the user.
            session_id: The ID of the session to delete.
            
        Returns:
            True if successful, False otherwise.
        """
        # Delete from Supabase
        response = (
            supabase_admin.table(self.table_name)
            .delete()
            .eq("user_id", str(user_id))
            .eq("session_id", str(session_id))
            .execute()
        )
        
        # Check if deletion was successful
        return response.data is not None


# Create a global instance
chat_history_repository = ChatHistoryRepository()