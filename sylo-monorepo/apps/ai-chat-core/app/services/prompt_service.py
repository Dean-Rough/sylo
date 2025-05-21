from typing import Dict, Any, List, Optional
import re
import json
from app.services.model_service import model_orchestrator
from app.core.config import settings
from app.models.prompt import PromptImproveRequest, PromptImproveResponse, PromptCategorizeRequest, PromptCategorizeResponse


class PromptService:
    """
    Service for prompt-related operations.
    """
    
    async def improve_prompt(self, request: PromptImproveRequest) -> PromptImproveResponse:
        """
        Improve a prompt using OpenAI.
        
        Args:
            request: The prompt improvement request.
            
        Returns:
            The improved prompt response.
        """
        try:
            # Create a system message for prompt improvement
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
                    "content": f"Please improve this prompt: \n\n{request.prompt_text}"
                }
            ]
            
            # Call model orchestrator to improve the prompt
            response = await model_orchestrator.generate_completion(
                messages=messages,
                model=request.model if request.model else settings.default_model,
                temperature=0.7
            )
            
            if "error" in response and response.get("error", False):
                # Handle error case
                return PromptImproveResponse(
                    original_prompt=request.prompt_text,
                    improved_prompt=request.prompt_text,  # Return original if error
                    success=False,
                    error=response.get("message", "Unknown error occurred")
                )
            
            # Extract the improved prompt from the response
            improved_prompt = response["choices"][0]["message"]["content"]
            
            if "error" in result and result.get("error", False):
                # Handle error case
                return PromptImproveResponse(
                    original_prompt=request.prompt_text,
                    improved_prompt=request.prompt_text,  # Return original if error
                    success=False,
                    error=result.get("message", "Unknown error occurred")
                )
            
            # Parse the improved prompt and explanation from the OpenAI response
            improved_prompt = result.get("improved_prompt", "")
            
            # Try to extract explanation if it's in a specific format
            explanation = None
            if ":" in improved_prompt:
                parts = improved_prompt.split(":", 1)
                if len(parts) > 1 and parts[0].strip().lower() in ["improved prompt", "improved version"]:
                    # Extract just the improved prompt part
                    improved_prompt = parts[1].strip()
                    
                # Look for explanation section
                if "explanation" in improved_prompt.lower():
                    sections = improved_prompt.split("explanation", 1, flags=re.IGNORECASE)
                    if len(sections) > 1:
                        improved_prompt = sections[0].strip()
                        explanation = sections[1].strip().lstrip(":").strip()
            
            return PromptImproveResponse(
                original_prompt=request.prompt_text,
                improved_prompt=improved_prompt,
                explanation=explanation,
                success=True
            )
            
        except Exception as e:
            # Handle any exceptions
            return PromptImproveResponse(
                original_prompt=request.prompt_text,
                improved_prompt=request.prompt_text,  # Return original if error
                success=False,
                error=str(e)
            )
    
    async def categorize_prompt(self, request: PromptCategorizeRequest) -> PromptCategorizeResponse:
        """
        Suggest categories for a prompt using OpenAI.
        
        Args:
            request: The prompt categorization request.
            
        Returns:
            The categorization response with suggested categories.
        """
        try:
            # Create a system message for categorization
            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are an expert at categorizing prompts for AI systems. "
                        "Your task is to suggest 1-5 relevant categories for the given prompt. "
                        "Categories should be single words or short phrases that describe the domain, "
                        "purpose, or content of the prompt. Respond with just a JSON array of strings."
                    )
                },
                {
                    "role": "user",
                    "content": f"Please suggest categories for this prompt: \n\n{request.prompt_text}"
                }
            ]
            
            # Call model orchestrator
            response = await model_orchestrator.generate_completion(
                messages=messages,
                temperature=0.3,  # Lower temperature for more consistent results
                model=request.model if request.model else settings.default_model
            )
            
            # Extract categories from response
            if "error" in response:
                return PromptCategorizeResponse(
                    prompt_text=request.prompt_text,
                    suggested_categories=[],
                    success=False,
                    error=response.get("message", "Failed to categorize prompt")
                )
            
            # Try to parse the response as JSON
            content = response["choices"][0]["message"]["content"]
            
            # Handle different response formats
            try:
                import json
                import re
                
                # Try to extract JSON array if wrapped in markdown code blocks or text
                json_match = re.search(r'```(?:json)?\s*(\[.*?\])\s*```', content, re.DOTALL)
                if json_match:
                    categories = json.loads(json_match.group(1))
                else:
                    # Try to find any array in the text
                    array_match = re.search(r'\[(.*?)\]', content, re.DOTALL)
                    if array_match:
                        # Clean up the array text and parse
                        array_text = array_match.group(1)
                        # Handle both quoted and unquoted formats
                        if '"' in array_text or "'" in array_text:
                            # Replace single quotes with double quotes for JSON parsing
                            array_text = array_text.replace("'", '"')
                            categories = json.loads(f"[{array_text}]")
                        else:
                            # Handle comma-separated words without quotes
                            categories = [c.strip() for c in array_text.split(',')]
                    else:
                        # Fallback: split by newlines or commas
                        categories = [
                            c.strip() for c in re.split(r'[,\n]', content) 
                            if c.strip() and not c.strip().startswith('{') and not c.strip().startswith('}')
                        ]
                
                # Ensure we have a list of strings
                categories = [str(c) for c in categories if c]
                
                # Limit to 5 categories
                categories = categories[:5]
                
            except Exception as e:
                # If JSON parsing fails, extract categories using regex
                print(f"Error parsing categories: {str(e)}")
                # Simple fallback: look for quoted strings or words after bullets/numbers
                categories = re.findall(r'["\'](.*?)["\']|[•\-\d+]\s+(.*?)(?:\n|$)', content)
                categories = [match[0] if match[0] else match[1] for match in categories]
                categories = [c.strip() for c in categories if c.strip()][:5]
            
            return PromptCategorizeResponse(
                prompt_text=request.prompt_text,
                suggested_categories=categories,
                success=True
            )
            
        except Exception as e:
            # Handle any exceptions
            return PromptCategorizeResponse(
                prompt_text=request.prompt_text,
                suggested_categories=[],
                success=False,
                error=str(e)
            )


# Create a global instance
prompt_service = PromptService()