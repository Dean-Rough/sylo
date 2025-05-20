from typing import Optional, List, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Header
from app.models.chat import ChatRequest, ChatResponse, Message, ChatHistoryEntry
from app.services.openai_service import openai_service
from app.crud.crud_chat_history import chat_history_repository
from app.crud.crud_user_settings import user_settings_repository

router = APIRouter(prefix="/chat", tags=["chat"])


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


@router.post("/completion", response_model=ChatResponse)
async def chat_completion(
    request: ChatRequest,
    user_id: UUID = Depends(get_user_id)
) -> ChatResponse:
    """
    Generate a chat completion using OpenAI.
    
    Args:
        request: The chat completion request.
        user_id: The ID of the user making the request.
        
    Returns:
        The chat completion response.
    """
    # Override user_id from the header (security measure)
    request.user_id = user_id
    
    # Get or create session ID if not provided
    session_id = request.session_id
    if not session_id:
        session_id = await chat_history_repository.create_new_session(user_id)
        request.session_id = session_id
    
    # Get user settings
    user_settings = await user_settings_repository.get_or_create_settings(user_id)
    
    # Apply user settings if not explicitly provided in the request
    if not request.model:
        request.model = user_settings.default_model
    if not request.temperature:
        request.temperature = user_settings.temperature
    if not request.max_tokens and user_settings.max_tokens:
        request.max_tokens = user_settings.max_tokens
    
    # Retrieve chat history for context
    memory_window = user_settings.memory_window
    history_entries = await chat_history_repository.get_session_history(
        user_id=user_id,
        session_id=session_id,
        limit=memory_window
    )
    
    # Convert history entries to message format
    history_messages = []
    for entry in history_entries:
        if entry.metadata and entry.metadata.get("session_start"):
            # Skip session start marker
            continue
        history_messages.append({
            "role": entry.role,
            "content": entry.content
        })
    
    # Combine history with current messages, respecting memory window
    all_messages = history_messages + [msg.dict() for msg in request.messages]
    if len(all_messages) > memory_window:
        all_messages = all_messages[-memory_window:]
    
    # Store user messages in chat history
    for msg in request.messages:
        if msg.role == "user":
            await chat_history_repository.create_entry(
                ChatHistoryEntry(
                    user_id=user_id,
                    session_id=session_id,
                    role=msg.role,
                    content=msg.content,
                    model=None  # User messages don't have a model
                )
            )
    
    # Call OpenAI API
    response = await openai_service.generate_chat_completion(
        messages=all_messages,
        model=request.model,
        temperature=request.temperature,
        max_tokens=request.max_tokens,
        tools=request.tools,
        tool_choice=request.tool_choice
    )
    
    # Handle errors
    if "error" in response and response.get("error", False):
        raise HTTPException(
            status_code=500,
            detail=f"OpenAI API error: {response.get('message', 'Unknown error')}"
        )
    
    # Extract assistant message
    assistant_message = response["choices"][0]["message"]
    
    # Create response message
    message = Message(
        role=assistant_message["role"],
        content=assistant_message["content"],
        function_call=assistant_message.get("function_call"),
        tool_calls=assistant_message.get("tool_calls")
    )
    
    # Store assistant message in chat history
    await chat_history_repository.create_entry(
        ChatHistoryEntry(
            user_id=user_id,
            session_id=session_id,
            role=message.role,
            content=message.content,
            model=request.model,
            metadata={
                "function_call": message.function_call,
                "tool_calls": message.tool_calls,
                "usage": response.get("usage")
            }
        )
    )
    
    # Create response
    chat_response = ChatResponse(
        message=message,
        session_id=session_id,
        usage=response.get("usage"),
        finish_reason=response["choices"][0].get("finish_reason")
    )
    
    return chat_response


@router.post("/sessions", response_model=Dict[str, UUID])
async def create_session(
    user_id: UUID = Depends(get_user_id)
) -> Dict[str, UUID]:
    """
    Create a new chat session.
    
    Args:
        user_id: The ID of the user making the request.
        
    Returns:
        Dictionary with the new session ID.
    """
    session_id = await chat_history_repository.create_new_session(user_id)
    return {"session_id": session_id}


@router.delete("/sessions/{session_id}", response_model=Dict[str, bool])
async def delete_session(
    session_id: UUID,
    user_id: UUID = Depends(get_user_id)
) -> Dict[str, bool]:
    """
    Delete a chat session.
    
    Args:
        session_id: The ID of the session to delete.
        user_id: The ID of the user making the request.
        
    Returns:
        Dictionary indicating success.
    """
    success = await chat_history_repository.delete_session(user_id, session_id)
    return {"success": success}