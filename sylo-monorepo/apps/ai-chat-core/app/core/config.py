from typing import Dict, List, Optional
from pydantic import BaseSettings, Field, validator


class ModelConfig(BaseSettings):
    """
    Configuration for a specific AI model.
    """
    provider: str
    model_id: str
    max_tokens: int = 4096
    supports_tools: bool = False
    supports_vision: bool = False
    supports_streaming: bool = True
    cost_per_1k_input: float = 0.0
    cost_per_1k_output: float = 0.0
    context_window: int = 8192
    priority: int = 0  # Lower number means higher priority


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    # Environment
    environment: str = Field("development", env="ENVIRONMENT")
    
    # OpenAI API Configuration
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    openai_org_id: Optional[str] = Field(None, env="OPENAI_ORG_ID")
    
    # Anthropic API Configuration (optional)
    anthropic_api_key: Optional[str] = Field(None, env="ANTHROPIC_API_KEY")
    
    # Default Model Configuration
    default_model: str = Field("gpt-4o", env="DEFAULT_MODEL")
    default_max_tokens: int = Field(1000, env="DEFAULT_MAX_TOKENS")
    default_temperature: float = Field(0.7, env="DEFAULT_TEMPERATURE")
    
    # Multi-Model Configuration
    enable_multi_model: bool = Field(True, env="ENABLE_MULTI_MODEL")
    available_models: List[str] = Field(["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"], env="AVAILABLE_MODELS")
    
    # Supabase Configuration
    supabase_url: str = Field(..., env="SUPABASE_URL")
    supabase_anon_key: str = Field(..., env="SUPABASE_ANON_KEY")
    supabase_service_role_key: str = Field(..., env="SUPABASE_SERVICE_ROLE_KEY")
    
    # API Configuration
    api_host: str = Field("0.0.0.0", env="API_HOST")
    api_port: int = Field(4000, env="API_PORT")
    api_root_path: str = Field("/api/v1", env="API_ROOT_PATH")
    
    # Model Configurations
    model_configs: Dict[str, ModelConfig] = {
        "gpt-4o": ModelConfig(
            provider="openai",
            model_id="gpt-4o",
            max_tokens=4096,
            supports_tools=True,
            supports_vision=True,
            supports_streaming=True,
            cost_per_1k_input=0.01,
            cost_per_1k_output=0.03,
            context_window=128000,
            priority=10
        ),
        "gpt-4-turbo": ModelConfig(
            provider="openai",
            model_id="gpt-4-turbo",
            max_tokens=4096,
            supports_tools=True,
            supports_vision=True,
            supports_streaming=True,
            cost_per_1k_input=0.01,
            cost_per_1k_output=0.03,
            context_window=128000,
            priority=20
        ),
        "gpt-3.5-turbo": ModelConfig(
            provider="openai",
            model_id="gpt-3.5-turbo",
            max_tokens=4096,
            supports_tools=True,
            supports_vision=False,
            supports_streaming=True,
            cost_per_1k_input=0.0005,
            cost_per_1k_output=0.0015,
            context_window=16385,
            priority=30
        ),
        "claude-3-opus": ModelConfig(
            provider="anthropic",
            model_id="claude-3-opus",
            max_tokens=4096,
            supports_tools=True,
            supports_vision=True,
            supports_streaming=True,
            cost_per_1k_input=0.015,
            cost_per_1k_output=0.075,
            context_window=200000,
            priority=15
        ),
        "claude-3-sonnet": ModelConfig(
            provider="anthropic",
            model_id="claude-3-sonnet",
            max_tokens=4096,
            supports_tools=True,
            supports_vision=True,
            supports_streaming=True,
            cost_per_1k_input=0.003,
            cost_per_1k_output=0.015,
            context_window=200000,
            priority=25
        )
    }
    
    @validator('available_models')
    def parse_available_models(cls, v, values):
        if isinstance(v, str):
            return [model.strip() for model in v.split(',')]
        return v
    
    @validator('available_models')
    def validate_available_models(cls, v, values):
        model_configs = values.get('model_configs', {})
        for model in v:
            if model not in model_configs:
                raise ValueError(f"Model '{model}' is not configured in model_configs")
        return v
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Create a global settings instance
settings = Settings()