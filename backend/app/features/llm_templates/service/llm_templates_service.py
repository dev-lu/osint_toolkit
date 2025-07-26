import logging
from typing import Optional, Dict, Any
from enum import Enum
import requests
import json

logger = logging.getLogger(__name__)


class ModelProvider(Enum):
    """Supported LLM model providers."""
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"


class LLMTemplateService:
    """Service class for LLM template operations."""
    
    DEFAULT_TEMPERATURE = 0.7
    DEFAULT_MAX_TOKENS = 1000
    DEFAULT_MODEL = "gpt-3.5-turbo"
    
    REQUEST_TIMEOUT = 30
    MAX_RETRIES = 3
    
    def __init__(self, api_key: str, provider: ModelProvider = ModelProvider.OPENAI):
        """
        Initialize the LLM service.
        
        Args:
            api_key: API key for the LLM provider
            provider: LLM provider to use
        """
        self.api_key = api_key
        self.provider = provider
        self._setup_provider_config()
    
    def _setup_provider_config(self) -> None:
        """Set up provider-specific configuration."""
        if self.provider == ModelProvider.OPENAI:
            self.endpoint = "https://api.openai.com/v1/chat/completions"
            self.headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            }
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")
    
    def execute_prompt(
        self,
        system_prompt: str,
        user_prompt: str,
        model_id: str = None,
        temperature: float = None,
        max_tokens: int = None
    ) -> str:
        """
        Execute a prompt using the configured LLM provider.
        
        Args:
            system_prompt: System/role prompt for the AI
            user_prompt: User input prompt
            model_id: Model to use (defaults to service default)
            temperature: Sampling temperature (0.0-1.0)
            max_tokens: Maximum tokens to generate
            
        Returns:
            Generated response text
            
        Raises:
            ValueError: If parameters are invalid
            RuntimeError: If API request fails
        """
        # Validate inputs
        if not system_prompt or not system_prompt.strip():
            raise ValueError("System prompt cannot be empty")
        if not user_prompt or not user_prompt.strip():
            raise ValueError("User prompt cannot be empty")
        
        # Set defaults
        model_id = model_id or self.DEFAULT_MODEL
        temperature = temperature if temperature is not None else self.DEFAULT_TEMPERATURE
        max_tokens = max_tokens or self.DEFAULT_MAX_TOKENS
        
        # Validate parameters
        if not (0.0 <= temperature <= 1.0):
            raise ValueError("Temperature must be between 0.0 and 1.0")
        if max_tokens <= 0:
            raise ValueError("Max tokens must be positive")
        
        logger.info(f"Executing prompt with model: {model_id}, temperature: {temperature}")
        
        try:
            response = self._make_api_request(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                model=model_id,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            result = self._extract_response_content(response)
            logger.info(f"Prompt executed successfully, response length: {len(result)}")
            return result
            
        except requests.RequestException as e:
            logger.error(f"API request failed: {str(e)}")
            raise RuntimeError(f"Failed to execute prompt: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error during prompt execution: {str(e)}")
            raise RuntimeError(f"Unexpected error: {str(e)}")
    
    def _make_api_request(
        self,
        system_prompt: str,
        user_prompt: str,
        model: str,
        temperature: float,
        max_tokens: int
    ) -> requests.Response:
        """
        Make API request to the LLM provider.
        
        Args:
            system_prompt: System prompt
            user_prompt: User prompt
            model: Model identifier
            temperature: Sampling temperature
            max_tokens: Maximum tokens
            
        Returns:
            API response object
            
        Raises:
            requests.RequestException: If request fails
        """
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        
        logger.debug(f"Making API request to {self.endpoint}")
        
        response = requests.post(
            self.endpoint,
            headers=self.headers,
            json=payload,
            timeout=self.REQUEST_TIMEOUT
        )
        
        self._handle_api_response(response)
        return response
    
    def _handle_api_response(self, response: requests.Response) -> None:
        """
        Handle API response and raise appropriate exceptions for errors.
        
        Args:
            response: API response object
            
        Raises:
            RuntimeError: For various API error conditions
        """
        if response.status_code == 200:
            return
        
        error_messages = {
            401: "Unauthorized - Invalid API key",
            403: "Forbidden - Access denied",
            429: "Rate limit exceeded - Please try again later",
            500: "Internal server error - Please try again later",
            502: "Bad gateway - Service temporarily unavailable",
            503: "Service unavailable - Please try again later"
        }
        
        error_msg = error_messages.get(
            response.status_code,
            f"API request failed with status {response.status_code}"
        )
        
        logger.error(f"API error {response.status_code}: {error_msg}")
        
        try:
            error_data = response.json()
            if "error" in error_data and "message" in error_data["error"]:
                error_msg += f" - {error_data['error']['message']}"
        except (json.JSONDecodeError, KeyError):
            pass
        
        raise RuntimeError(error_msg)
    
    def _extract_response_content(self, response: requests.Response) -> str:
        """
        Extract content from API response.
        
        Args:
            response: API response object
            
        Returns:
            Extracted content text
            
        Raises:
            RuntimeError: If response format is invalid
        """
        try:
            response_data = response.json()
            
            if "choices" not in response_data or not response_data["choices"]:
                raise RuntimeError("Invalid response format: no choices found")
            
            choice = response_data["choices"][0]
            
            if "message" not in choice or "content" not in choice["message"]:
                raise RuntimeError("Invalid response format: no message content found")
            
            content = choice["message"]["content"]
            
            if not isinstance(content, str):
                raise RuntimeError("Invalid response format: content is not a string")
            
            return content.strip()
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {str(e)}")
            raise RuntimeError("Invalid JSON response from API")
        except KeyError as e:
            logger.error(f"Missing key in response: {str(e)}")
            raise RuntimeError(f"Invalid response format: missing {str(e)}")


def create_llm_service(api_key: str, provider: str = "openai") -> LLMTemplateService:
    """
    Factory function to create LLM service instance.
    
    Args:
        api_key: API key for the provider
        provider: Provider name (default: "openai")
        
    Returns:
        Configured LLMTemplateService instance
        
    Raises:
        ValueError: If provider is not supported
    """
    try:
        provider_enum = ModelProvider(provider.lower())
        return LLMTemplateService(api_key=api_key, provider=provider_enum)
    except ValueError:
        supported = [p.value for p in ModelProvider]
        raise ValueError(f"Unsupported provider '{provider}'. Supported: {supported}")


# Legacy function for backward compatibility
def execute_prompt(
    ai_agent_role: str,
    ai_agent_task: str,
    api_key: str,
    model: str = "gpt-3.5-turbo",
    temperature: float = 0.6,
    max_tokens: int = 1000
) -> Optional[str]:
    """
    Legacy function for executing prompts.
    
    This function is maintained for backward compatibility.
    New code should use LLMTemplateService directly.
    
    Args:
        ai_agent_role: System prompt/role
        ai_agent_task: User prompt/task
        api_key: OpenAI API key
        model: Model to use
        temperature: Sampling temperature
        max_tokens: Maximum tokens
        
    Returns:
        Generated response or None on error
    """
    logger.warning("Using deprecated execute_prompt function. Use LLMTemplateService instead.")
    
    try:
        service = LLMTemplateService(api_key=api_key, provider=ModelProvider.OPENAI)
        return service.execute_prompt(
            system_prompt=ai_agent_role,
            user_prompt=ai_agent_task,
            model_id=model,
            temperature=temperature,
            max_tokens=max_tokens
        )
    except Exception as e:
        logger.error(f"Legacy execute_prompt failed: {str(e)}")
        return None
