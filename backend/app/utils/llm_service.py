import logging
from typing import Dict, Any, Optional, Union, List
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from sqlalchemy.orm import Session
from app.core.settings.api_keys.crud.api_keys_settings_crud import get_apikey

logger = logging.getLogger(__name__)

class LLMService:
    """Service for interacting with various LLM providers through a unified interface"""
    
    def __init__(self):
        self.models: Dict[str, BaseChatModel] = {}
        
    def register_model(self, model_id: str, model_instance: BaseChatModel) -> None:
        """Register a LangChain model instance with a unique identifier"""
        self.models[model_id] = model_instance
    
    def setup_openai_model(
        self, 
        model_id: str, 
        model_name: str = "gpt-3.5-turbo", 
        api_key: str = None,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> None:
        """Setup and register an OpenAI model"""
        self.register_model(
            model_id,
            ChatOpenAI(
                model_name=model_name,
                openai_api_key=api_key,
                temperature=temperature,
                max_tokens=max_tokens
            )
        )
    
    def setup_anthropic_model(
        self, 
        model_id: str, 
        model_name: str = "claude-3-haiku-20240307", 
        api_key: str = None,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> None:
        """Setup and register an Anthropic model"""
        self.register_model(
            model_id,
            ChatAnthropic(
                model_name=model_name,
                anthropic_api_key=api_key,
                temperature=temperature,
                max_tokens=max_tokens
            )
        )
    
    def setup_google_model(
        self, 
        model_id: str, 
        model_name: str = "gemini-pro", 
        api_key: str = None,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> None:
        """Setup and register a Google Gemini model"""
        self.register_model(
            model_id,
            ChatGoogleGenerativeAI(
                model=model_name,
                google_api_key=api_key,
                temperature=temperature,
                max_output_tokens=max_tokens
            )
        )
    
    def execute_prompt(
        self,
        model_id: str,
        system_prompt: str,
        user_prompt: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> str:
        """
        Execute a prompt using the specified model
        
        Args:
            model_id: Identifier for the model to use
            system_prompt: Instructions for the AI's role/behavior
            user_prompt: The actual task/question for the AI
            temperature: Optional override for the model's temperature
            max_tokens: Optional override for the model's max tokens
            
        Returns:
            The model's response as a string
        """
        if model_id not in self.models:
            raise ValueError(f"Model '{model_id}' not registered")
        
        model = self.models[model_id]
        
        # Create override parameters if provided
        model_kwargs = {}
        if temperature is not None:
            model_kwargs["temperature"] = temperature
        if max_tokens is not None:
            # Handle different parameter names for max tokens
            if isinstance(model, ChatOpenAI) or isinstance(model, ChatAnthropic):
                model_kwargs["max_tokens"] = max_tokens
            elif isinstance(model, ChatGoogleGenerativeAI):
                model_kwargs["max_output_tokens"] = max_tokens
        
        # Create message list
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ]
        
        try:
            # Invoke the model with optional overrides
            if model_kwargs:
                response = model.invoke(messages, **model_kwargs)
            else:
                response = model.invoke(messages)
            
            return response.content
        except Exception as e:
            logging.error(f"Error executing prompt with model '{model_id}': {e}")
            raise Exception(f"Failed to execute prompt: {str(e)}")


def create_llm_service(db: Session):
    """Create and configure the LLM service with available models
    
    Args:
        db: Database session to use for retrieving API keys
        
    Returns:
        Configured LLMService instance
    """
    service = LLMService()
    
    # Get API keys from database using the provided session
    openai_key_obj = get_apikey(name="openai", db=db)
    anthropic_key_obj = get_apikey(name="anthropic", db=db)
    gemini_key_obj = get_apikey(name="gemini", db=db)
    
    # Extract the actual key string from the returned objects
    openai_api_key = openai_key_obj.get('key') if openai_key_obj else None
    anthropic_api_key = anthropic_key_obj.get('key') if anthropic_key_obj else None
    gemini_api_key = gemini_key_obj.get('key') if gemini_key_obj else None
    
    # Log key availability (without revealing the actual keys)
    logger.info(f"OpenAI API key available: {openai_api_key is not None}")
    logger.info(f"Anthropic API key available: {anthropic_api_key is not None}")
    logger.info(f"Gemini API key available: {gemini_api_key is not None}")
    
    # Setup OpenAI models
    if openai_api_key:
        service.setup_openai_model(
            model_id="gpt-3.5",
            model_name="gpt-3.5-turbo",
            api_key=openai_api_key
        )
        
        service.setup_openai_model(
            model_id="gpt-4",
            model_name="gpt-4-turbo-preview",
            api_key=openai_api_key
        )

        service.setup_openai_model(
            model_id="gpt-4o",
            model_name="gpt-4o",
            api_key=openai_api_key
        )
    
    # Setup Anthropic models
    if anthropic_api_key:
        service.setup_anthropic_model(
            model_id="claude-haiku",
            model_name="claude-3-haiku-20240307",
            api_key=anthropic_api_key
        )
    
    # Setup Google models
    if gemini_api_key:
        service.setup_google_model(
            model_id="gemini-pro",
            model_name="gemini-pro",
            api_key=gemini_api_key
        )
    
    return service