from typing import List, Dict, Any, Optional, Union
import httpx
from app.core.config import settings, ModelConfig
from app.services.model_service import ModelService


class AnthropicService(ModelService):
    """
    Service for interacting with Anthropic Claude models.
    """
    
    def __init__(self):
        """
        Initialize the Anthropic service.
        """
        self.api_key = settings.anthropic_api_key
        self.api_url = "https://api.anthropic.com/v1/messages"
        self.supported_models = {
            model_id: config 
            for model_id, config in settings.model_configs.items() 
            if config.provider == "anthropic"
        }
        
        # Check if API key is available
        if not self.api_key:
            print("Warning: Anthropic API key not set. Anthropic models will not be available.")
    
    async def generate_completion(
        self,
        messages: List[Dict[str, str]],
        model: str,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: Optional[Union[str, Dict[str, Any]]] = None,
        stream: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate a chat completion using Anthropic's API.
        
        Args:
            messages: List of message objects with role and content.
            model: The Anthropic model to use.
            temperature: Controls randomness (0-1).
            max_tokens: Maximum number of tokens to generate.
            tools: List of tools available to the model.
            tool_choice: Control when the model calls functions.
            stream: Whether to stream the response.
            **kwargs: Additional model-specific parameters.
            
        Returns:
            Dict containing the API response.
        """
        # Check if API key is available
        if not self.api_key:
            return {
                "error": True,
                "message": "Anthropic API key not set",
                "type": "ConfigurationError"
            }
        
        # Validate model
        if not self.supports_model(model):
            return {
                "error": True,
                "message": f"Model '{model}' is not supported by Anthropic service",
                "type": "UnsupportedModelError"
            }
        
        try:
            # Convert OpenAI-style messages to Anthropic format
            anthropic_messages = self._convert_messages(messages)
            
            # Build request payload
            payload = {
                "model": model,
                "messages": anthropic_messages,
                "temperature": temperature,
                "max_tokens": max_tokens if max_tokens is not None else 1024,
                "stream": stream,
            }
            
            # Add tools if provided
            if tools is not None:
                payload["tools"] = self._convert_tools(tools)
            
            # Add any additional parameters
            for key, value in kwargs.items():
                if value is not None:
                    payload[key] = value
            
            # Make the API call
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.api_url,
                    json=payload,
                    headers={
                        "x-api-key": self.api_key,
                        "anthropic-version": "2023-06-01",
                        "content-type": "application/json"
                    }
                )
                
                # Check for errors
                if response.status_code != 200:
                    return {
                        "error": True,
                        "message": f"Anthropic API error: {response.text}",
                        "type": "AnthropicAPIError",
                        "status_code": response.status_code
                    }
                
                # Parse response
                data = response.json()
                
                # Convert Anthropic response to OpenAI-like format for consistency
                return self._convert_response_to_openai_format(data)
                
        except Exception as e:
            # Log the error and return a structured error response
            print(f"Error calling Anthropic API: {str(e)}")
            return {
                "error": True,
                "message": str(e),
                "type": type(e).__name__
            }
    
    async def get_model_info(self, model: str) -> Optional[ModelConfig]:
        """
        Get information about a specific model.
        
        Args:
            model: The model identifier.
            
        Returns:
            ModelConfig object containing model information, or None if not found.
        """
        return self.supported_models.get(model)
    
    def supports_model(self, model: str) -> bool:
        """
        Check if this service supports the specified model.
        
        Args:
            model: The model identifier.
            
        Returns:
            True if the model is supported, False otherwise.
        """
        return model in self.supported_models and self.api_key is not None
    
    def _convert_messages(self, openai_messages: List[Dict[str, str]]) -> List[Dict[str, Any]]:
        """
        Convert OpenAI-style messages to Anthropic format.
        
        Args:
            openai_messages: List of OpenAI-style message objects.
            
        Returns:
            List of Anthropic-style message objects.
        """
        anthropic_messages = []
        
        for msg in openai_messages:
            role = msg["role"]
            content = msg["content"]
            
            # Map OpenAI roles to Anthropic roles
            if role == "system":
                # System messages in Anthropic are handled differently
                # We'll add it as a system message at the beginning
                anthropic_messages.insert(0, {"role": "system", "content": content})
            elif role == "user":
                anthropic_messages.append({"role": "user", "content": content})
            elif role == "assistant":
                anthropic_messages.append({"role": "assistant", "content": content})
            elif role == "function":
                # Anthropic doesn't have direct function messages, so we'll format it as assistant
                anthropic_messages.append({
                    "role": "assistant", 
                    "content": f"Function result: {content}"
                })
        
        return anthropic_messages
    
    def _convert_tools(self, openai_tools: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Convert OpenAI-style tools to Anthropic format.
        
        Args:
            openai_tools: List of OpenAI-style tool objects.
            
        Returns:
            List of Anthropic-style tool objects.
        """
        # Anthropic tools are similar to OpenAI tools, but may have some differences
        # For now, we'll pass them through with minimal changes
        anthropic_tools = []
        
        for tool in openai_tools:
            if "function" in tool:
                # Convert function tool
                anthropic_tools.append({
                    "type": "function",
                    "function": {
                        "name": tool["function"]["name"],
                        "description": tool["function"].get("description", ""),
                        "parameters": tool["function"].get("parameters", {})
                    }
                })
        
        return anthropic_tools
    
    def _convert_response_to_openai_format(self, anthropic_response: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert Anthropic response to OpenAI-like format for consistency.
        
        Args:
            anthropic_response: The response from Anthropic API.
            
        Returns:
            Dict in OpenAI-like format.
        """
        # Extract content from Anthropic response
        content = anthropic_response["content"][0]["text"]
        
        # Extract tool calls if present
        tool_calls = None
        if "tool_calls" in anthropic_response:
            tool_calls = anthropic_response["tool_calls"]
        
        # Create OpenAI-like response
        openai_response = {
            "id": anthropic_response.get("id", ""),
            "object": "chat.completion",
            "created": anthropic_response.get("created", 0),
            "model": anthropic_response.get("model", ""),
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": content,
                    },
                    "finish_reason": anthropic_response.get("stop_reason", "stop")
                }
            ],
            "usage": {
                "prompt_tokens": anthropic_response.get("usage", {}).get("input_tokens", 0),
                "completion_tokens": anthropic_response.get("usage", {}).get("output_tokens", 0),
                "total_tokens": (
                    anthropic_response.get("usage", {}).get("input_tokens", 0) +
                    anthropic_response.get("usage", {}).get("output_tokens", 0)
                )
            }
        }
        
        # Add tool calls if present
        if tool_calls:
            openai_response["choices"][0]["message"]["tool_calls"] = tool_calls
        
        return openai_response


# Create a global instance of the service if API key is available
if settings.anthropic_api_key:
    anthropic_service = AnthropicService()
    
    # Register with the model orchestrator
    from app.services.model_service import model_orchestrator
    model_orchestrator.register_service("anthropic", anthropic_service)