from supabase import create_client, Client
from app.core.config import settings


def get_supabase_client() -> Client:
    """
    Create and return a Supabase client instance.
    
    Returns:
        Client: A configured Supabase client.
    """
    return create_client(
        settings.supabase_url,
        settings.supabase_anon_key
    )


def get_supabase_admin_client() -> Client:
    """
    Create and return a Supabase client with admin privileges (service role).
    Use this for operations that require elevated permissions.
    
    Returns:
        Client: A configured Supabase client with admin privileges.
    """
    return create_client(
        settings.supabase_url,
        settings.supabase_service_role_key
    )


# Create global client instances
supabase = get_supabase_client()
supabase_admin = get_supabase_admin_client()