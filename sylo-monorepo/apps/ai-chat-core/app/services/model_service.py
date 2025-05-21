from typing import List, Dict, Any, Optional, Union
from abc import ABC, abstractmethod
from app.core.config import settings, ModelConfig


class ModelService(ABC):
    """
    Abstract base class for AI model services.
    """
    
    @abstractmethod
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
        Generate a completion using the AI model.
        
        Args:
            messages: List of message objects with role and content.
            model: The model to use.
            temperature: Controls randomness (0-1).
            max_tokens: Maximum number of tokens to generate.
            tools: List of tools available to the model.
            tool_choice: Control when the model calls functions.
            stream: Whether to stream the response.
            **kwargs: Additional model-specific parameters.
            
        Returns:
            Dict containing the API response.
        """
        pass
    
    @abstractmethod
    async def get_model_info(self, model: str) -> ModelConfig:
        """
        Get information about a specific model.
        
        Args:
            model: The model identifier.
            
        Returns:
            ModelConfig object containing model information.
        """
        pass
    
    @abstractmethod
    def supports_model(self, model: str) -> bool:
        """
        Check if this service supports the specified model.
        
        Args:
            model: The model identifier.
            
        Returns:
            True if the model is supported, False otherwise.
        """
        pass


class ModelOrchestrator:
    """
    Orchestrates requests between different model providers.
    """
    
    def __init__(self):
        self.services = {}
        self.model_configs = settings.model_configs
        self.available_models = settings.available_models
    
    def register_service(self, provider: str, service: ModelService):
        """
        Register a model service for a specific provider.
        
        Args:
            provider: The provider name (e.g., 'openai', 'anthropic').
            service: The model service instance.
        """
        self.services[provider] = service
    
    def get_service_for_model(self, model: str) -> Optional[ModelService]:
        """
        Get the appropriate service for a specific model.
        
        Args:
            model: The model identifier.
            
        Returns:
            The appropriate ModelService instance, or None if not found.
        """
        if model not in self.model_configs:
            return None
        
        provider = self.model_configs[model].provider
        return self.services.get(provider)
    
    async def generate_completion(
        self,
        messages: List[Dict[str, str]],
        model: str = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: Optional[Union[str, Dict[str, Any]]] = None,
        stream: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate a completion using the appropriate model service.
        
        Args:
            messages: List of message objects with role and content.
            model: The model to use (defaults to settings.default_model).
            temperature: Controls randomness (0-1).
            max_tokens: Maximum number of tokens to generate.
            tools: List of tools available to the model.
            tool_choice: Control when the model calls functions.
            stream: Whether to stream the response.
            **kwargs: Additional model-specific parameters.
            
        Returns:
            Dict containing the API response.
        """
        # Use default model if not specified
        if not model:
            model = settings.default_model
        
        # Check if model is available
        if model not in self.available_models:
            return {
                "error": True,
                "message": f"Model '{model}' is not available. Available models: {', '.join(self.available_models)}",
                "type": "ModelNotAvailableError"
            }
        
        # Get the appropriate service
        service = self.get_service_for_model(model)
        if not service:
            return {
                "error": True,
                "message": f"No service available for model '{model}'",
                "type": "ServiceNotAvailableError"
            }
        
        # Generate completion
        try:
            return await service.generate_completion(
                messages=messages,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens,
                tools=tools,
                tool_choice=tool_choice,
                stream=stream,
                **kwargs
            )
        except Exception as e:
            return {
                "error": True,
                "message": str(e),
                "type": type(e).__name__
            }
    
    def get_model_info(self, model: str) -> Optional[ModelConfig]:
        """
        Get information about a specific model.
        
        Args:
            model: The model identifier.
            
        Returns:
            ModelConfig object containing model information, or None if not found.
        """
        return self.model_configs.get(model)
    
    def get_available_models(self) -> List[Dict[str, Any]]:
        """
        Get a list of all available models with their configurations.
        
        Returns:
            List of model configurations.
        """
        return [
            {
                "id": model,
                "provider": self.model_configs[model].provider,
                "supports_tools": self.model_configs[model].supports_tools,
                "supports_vision": self.model_configs[model].supports_vision,
                "supports_streaming": self.model_configs[model].supports_streaming,
                "context_window": self.model_configs[model].context_window,
                "cost_per_1k_input": self.model_configs[model].cost_per_1k_input,
                "cost_per_1k_output": self.model_configs[model].cost_per_1k_output,
            }
            for model in self.available_models
        ]


# Create a global model orchestrator instance
model_orchestrator = ModelOrchestrator()