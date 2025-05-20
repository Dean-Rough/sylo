from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID


class Message(BaseModel):
    """
    Represents a single message in a chat conversation.
    """
    role: str = Field(..., description="The role of the message sender (system, user, assistant)")
    content: str = Field(..., description="The content of the message")
    name: Optional[str] = Field(None, description="The name of the message sender (optional)")
    function_call: Optional[Dict[str, Any]] = Field(None, description="Function call information if applicable")
    tool_calls: Optional[List[Dict[str, Any]]] = Field(None, description="Tool calls information if applicable")


class ChatRequest(BaseModel):
    """
    Request model for chat completion.
    """
    messages: List[Message] = Field(..., description="List of messages in the conversation")
    model: str = Field("gpt-4o", description="The OpenAI model to use")
    temperature: float = Field(0.7, description="Controls randomness (0-1)")
    max_tokens: Optional[int] = Field(None, description="Maximum number of tokens to generate")
    user_id: UUID = Field(..., description="The ID of the user making the request")
    session_id: Optional[UUID] = Field(None, description="The session/thread ID for this conversation")
    tools: Optional[List[Dict[str, Any]]] = Field(None, description="List of tools available to the model")
    tool_choice: Optional[str] = Field(None, description="Control when the model calls functions")


class ChatResponse(BaseModel):
    """
    Response model for chat completion.
    """
    message: Message = Field(..., description="The generated message")
    session_id: UUID = Field(..., description="The session/thread ID for this conversation")
    created_at: datetime = Field(default_factory=datetime.now, description="When this response was created")
    usage: Optional[Dict[str, int]] = Field(None, description="Token usage information")
    finish_reason: Optional[str] = Field(None, description="Reason why the generation finished")


class ChatHistoryEntry(BaseModel):
    """
    Model for storing chat history in the database.
    """
    id: Optional[UUID] = Field(None, description="The ID of this chat history entry")
    user_id: UUID = Field(..., description="The ID of the user")
    session_id: UUID = Field(..., description="The session/thread ID for this conversation")
    role: str = Field(..., description="The role of the message sender")
    content: str = Field(..., description="The content of the message")
    model: Optional[str] = Field(None, description="The model used for assistant messages")
    created_at: datetime = Field(default_factory=datetime.now, description="When this message was created")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata for this message")