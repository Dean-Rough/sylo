from typing import List, Dict, Any, Optional
import openai
from app.core.config import settings

# Configure OpenAI API key
openai.api_key = settings.openai_api_key


class OpenAIService:
    """
    Service for interacting with OpenAI models.
    """
    
    @staticmethod
    async def generate_chat_completion(
        messages: List[Dict[str, str]],
        model: str = "gpt-4o",
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: Optional[str] = None
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
            
        Returns:
            Dict containing the API response.
        """
        try:
            # Build request parameters
            params = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
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
    
    @staticmethod
    async def improve_prompt(prompt: str) -> Dict[str, Any]:
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
            response = await openai.ChatCompletion.acreate(
                model="gpt-4o",
                messages=messages,
                temperature=0.7
            )
            
            improved_prompt = response.choices[0].message.content
            
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