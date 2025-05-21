from typing import List, Dict, Any, Optional, Union
import openai
from app.core.config import settings, ModelConfig
from app.services.model_service import ModelService

# Configure OpenAI API key
openai.api_key = settings.openai_api_key
if settings.openai_org_id:
    openai.organization = settings.openai_org_id


class OpenAIService(ModelService):
    """
    Service for interacting with OpenAI models.
    """
    
    def __init__(self):
        """
        Initialize the OpenAI service.
        """
        self.supported_models = {
            model_id: config
            for model_id, config in settings.model_configs.items()
            if config.provider == "openai"
        }
    
    async def generate_completion(
        self,
        messages: List[Dict[str, str]],
        model: str = "gpt-4o",
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: Optional[Union[str, Dict[str, Any]]] = None,
        stream: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate a chat completion using OpenAI's API.
        
        Args:
            messages: List of message objects with role and content.
            model: The OpenAI model to use.
            temperature: Controls randomness (0-1).
            max_tokens: Maximum number of tokens to generate.
            tools: List of tools available to the model.
            tool_choice: Control when the model calls functions.
            stream: Whether to stream the response.
            **kwargs: Additional model-specific parameters.
            
        Returns:
            Dict containing the API response.
        """
        try:
            # Validate model
            if not self.supports_model(model):
                return {
                    "error": True,
                    "message": f"Model '{model}' is not supported by OpenAI service",
                    "type": "UnsupportedModelError"
                }
            
            # Build request parameters
            params = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "stream": stream,
                **kwargs  # Include any additional parameters
            }
            
            # Add optional parameters if provided
            if max_tokens is not None:
                params["max_tokens"] = max_tokens
                
            if tools is not None:
                params["tools"] = tools
                
            if tool_choice is not None:
                params["tool_choice"] = tool_choice
            
            # Make the API call
            response = await openai.ChatCompletion.acreate(**params)
            return response
            
        except Exception as e:
            # Log the error and return a structured error response
            print(f"Error calling OpenAI API: {str(e)}")
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
        return model in self.supported_models
    
    async def improve_prompt(self, prompt: str) -> Dict[str, Any]:
        """
        Use OpenAI to improve a given prompt.
        
        Args:
            prompt: The original prompt to improve.
            
        Returns:
            Dict containing the improved prompt and explanation.
        """
        messages = [
            {
                "role": "system",
                "content": (
                    "You are an expert at writing effective prompts for AI systems. "
                    "Your task is to improve the given prompt to make it clearer, "
                    "more specific, and more likely to generate the desired response. "
                    "Provide both an improved version and a brief explanation of your changes."
                )
            },
            {
                "role": "user",
                "content": f"Please improve this prompt: \n\n{prompt}"
            }
        ]
        
        try:
            response = await self.generate_completion(
                messages=messages,
                model=settings.default_model,
                temperature=0.7
            )
            
            if "error" in response and response.get("error", False):
                return {
                    "original_prompt": prompt,
                    "error": True,
                    "message": response.get("message", "Unknown error"),
                    "success": False
                }
            
            improved_prompt = response["choices"][0]["message"]["content"]
            
            return {
                "original_prompt": prompt,
                "improved_prompt": improved_prompt,
                "success": True
            }
            
        except Exception as e:
            print(f"Error improving prompt: {str(e)}")
            return {
                "original_prompt": prompt,
                "error": True,
                "message": str(e),
                "success": False
            }


# Create a global instance of the service
openai_service = OpenAIService()

# Register with the model orchestrator
from app.services.model_service import model_orchestrator
model_orchestrator.register_service("openai", openai_service)