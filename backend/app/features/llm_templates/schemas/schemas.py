import json
import logging
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field, field_validator, model_validator

logger = logging.getLogger(__name__)


class PayloadField(BaseModel):
    """Schema for template payload field definitions."""
    name: str = Field(..., description="Field name", min_length=1, max_length=100)
    description: str = Field(..., description="Field description", max_length=500)
    required: bool = Field(True, description="Whether the field is required")
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        """Validate field name format."""
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Field name must contain only alphanumeric characters, hyphens, and underscores')
        return v


class StaticContext(BaseModel):
    """Schema for static context definitions."""
    name: str = Field(..., description="Context name", min_length=1, max_length=200)
    content: str = Field(..., description="Context content", max_length=50000)
    description: Optional[str] = Field(None, description="Context description", max_length=500)


class WebContext(BaseModel):
    """Schema for web context definitions."""
    name: str = Field(..., description="Context name", min_length=1, max_length=200)
    url: str = Field(..., description="URL to fetch content from")
    description: Optional[str] = Field(None, description="Context description", max_length=500)
    
    @field_validator('url')
    @classmethod
    def validate_url(cls, v):
        """Validate URL format."""
        if not v.startswith(('http://', 'https://')):
            raise ValueError('URL must start with http:// or https://')
        return v


class AITemplateBase(BaseModel):
    """Base schema for AI templates."""
    title: str = Field(..., description="Template title", min_length=1, max_length=200)
    description: Optional[str] = Field(None, description="Template description", max_length=1000)
    example_input_output: Optional[str] = Field(None, description="Example usage", max_length=5000)
    ai_agent_role: str = Field(..., description="AI agent role/system prompt", min_length=1, max_length=2000)
    ai_agent_task: str = Field(..., description="AI agent task/user prompt", min_length=1, max_length=5000)
    payload_fields: List[Dict[str, Any]] = Field(default_factory=list, description="Template payload fields")
    static_contexts: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="Static contexts")
    web_contexts: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="Web contexts")
    is_public: bool = Field(False, description="Whether template is public")
    order_number: Optional[int] = Field(0, description="Display order", ge=0)
    temperature: Optional[float] = Field(0.7, description="LLM temperature", ge=0.0, le=1.0)
    model: Optional[str] = Field("gpt-4", description="LLM model to use", max_length=100)

    @field_validator('payload_fields')
    @classmethod
    def validate_payload_fields(cls, v):
        """Validate payload fields structure."""
        if not isinstance(v, list):
            raise ValueError('Payload fields must be a list')
        
        field_names = set()
        for field in v:
            if not isinstance(field, dict):
                raise ValueError('Each payload field must be a dictionary')
            
            # Validate required keys
            if 'name' not in field:
                raise ValueError('Payload field must have a name')
            if 'description' not in field:
                raise ValueError('Payload field must have a description')
            
            name = field['name']
            if name in field_names:
                raise ValueError(f'Duplicate payload field name: {name}')
            field_names.add(name)
            
            try:
                PayloadField(**field)
            except Exception as e:
                raise ValueError(f'Invalid payload field "{name}": {str(e)}')
        
        return v

    @field_validator('static_contexts')
    @classmethod
    def validate_static_contexts(cls, v):
        """Validate static contexts structure."""
        if not v:
            return []
        
        if not isinstance(v, list):
            raise ValueError('Static contexts must be a list')
        
        for i, context in enumerate(v):
            if not isinstance(context, dict):
                raise ValueError(f'Static context {i} must be a dictionary')
            
            try:
                StaticContext(**context)
            except Exception as e:
                raise ValueError(f'Invalid static context {i}: {str(e)}')
        
        return v

    @field_validator('web_contexts')
    @classmethod
    def validate_web_contexts(cls, v):
        """Validate web contexts structure."""
        if not v:
            return []
        
        if not isinstance(v, list):
            raise ValueError('Web contexts must be a list')
        
        for i, context in enumerate(v):
            if not isinstance(context, dict):
                raise ValueError(f'Web context {i} must be a dictionary')
            
            try:
                WebContext(**context)
            except Exception as e:
                raise ValueError(f'Invalid web context {i}: {str(e)}')
        
        return v

    @field_validator('model')
    @classmethod
    def validate_model(cls, v):
        """Validate model name."""
        if v and not v.strip():
            raise ValueError('Model name cannot be empty')
        return v.strip() if v else "gpt-4"


class AITemplateCreate(AITemplateBase):
    """Schema for creating AI templates."""
    pass


class AITemplateUpdate(BaseModel):
    """Schema for updating AI templates."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    example_input_output: Optional[str] = Field(None, max_length=5000)
    ai_agent_role: Optional[str] = Field(None, min_length=1, max_length=2000)
    ai_agent_task: Optional[str] = Field(None, min_length=1, max_length=5000)
    payload_fields: Optional[List[Dict[str, Any]]] = None
    static_contexts: Optional[List[Dict[str, Any]]] = None
    web_contexts: Optional[List[Dict[str, Any]]] = None
    is_public: Optional[bool] = None
    order_number: Optional[int] = Field(None, ge=0)
    temperature: Optional[float] = Field(None, ge=0.0, le=1.0)
    model: Optional[str] = Field(None, max_length=100)

    @field_validator('payload_fields')
    @classmethod
    def validate_payload_fields(cls, v):
        """Validate payload fields structure."""
        return AITemplateBase.validate_payload_fields(v) if v is not None else v

    @field_validator('static_contexts')
    @classmethod
    def validate_static_contexts(cls, v):
        """Validate static contexts structure."""
        return AITemplateBase.validate_static_contexts(v) if v is not None else v

    @field_validator('web_contexts')
    @classmethod
    def validate_web_contexts(cls, v):
        """Validate web contexts structure."""
        return AITemplateBase.validate_web_contexts(v) if v is not None else v

    @field_validator('model')
    @classmethod
    def validate_model(cls, v):
        """Validate model name."""
        return AITemplateBase.validate_model(v) if v is not None else v


class AITemplate(BaseModel):
    """Schema for AI template responses."""
    id: str
    title: str
    description: Optional[str] = None
    example_input_output: Optional[str] = None
    ai_agent_role: str
    ai_agent_task: str
    payload_fields: Union[List[Dict[str, Any]], str]
    static_contexts: Union[List[Dict[str, Any]], str]
    web_contexts: Union[List[Dict[str, Any]], str]
    is_public: bool = False
    user_id: Optional[str] = None
    order_number: Optional[int] = 0
    temperature: Optional[float] = 0.7
    model: Optional[str] = "gpt-4"

    class Config:
        from_attributes = True

    @property
    def parsed_payload_fields(self) -> List[Dict[str, Any]]:
        """Parse payload fields from JSON string if needed."""
        return self._parse_json_field(self.payload_fields, 'payload_fields')

    @property
    def parsed_static_contexts(self) -> List[Dict[str, Any]]:
        """Parse static contexts from JSON string if needed."""
        return self._parse_json_field(self.static_contexts, 'static_contexts')

    @property
    def parsed_web_contexts(self) -> List[Dict[str, Any]]:
        """Parse web contexts from JSON string if needed."""
        return self._parse_json_field(self.web_contexts, 'web_contexts')

    def _parse_json_field(self, field_data: Union[str, List, Dict], field_name: str) -> List[Dict[str, Any]]:
        """
        Parse JSON field data with error handling.
        
        Args:
            field_data: Raw field data
            field_name: Field name for logging
            
        Returns:
            Parsed data as list of dictionaries
        """
        if isinstance(field_data, str):
            try:
                parsed = json.loads(field_data)
                return parsed if isinstance(parsed, list) else []
            except (json.JSONDecodeError, TypeError) as e:
                logger.warning(f"Failed to parse {field_name} for template {getattr(self, 'id', 'unknown')}: {str(e)}")
                return []
        elif isinstance(field_data, list):
            return field_data
        else:
            return []

    def dict(self, *args, **kwargs):
        """Override dict method to include parsed fields."""
        base_dict = super().dict(*args, **kwargs)
        base_dict['payload_fields'] = self.parsed_payload_fields
        base_dict['static_contexts'] = self.parsed_static_contexts
        base_dict['web_contexts'] = self.parsed_web_contexts
        return base_dict


class AITemplateOutput(AITemplateBase):
    """Schema for template output with parsing."""
    id: str
    user_id: Optional[str] = None
    
    @field_validator('payload_fields', mode='before')
    @classmethod
    def parse_payload_fields(cls, v):
        """Parse payload fields from JSON string."""
        return cls._parse_json_field_validator(v, 'payload_fields')
    
    @field_validator('static_contexts', mode='before')
    @classmethod
    def parse_static_contexts(cls, v):
        """Parse static contexts from JSON string."""
        return cls._parse_json_field_validator(v, 'static_contexts')
    
    @field_validator('web_contexts', mode='before')
    @classmethod
    def parse_web_contexts(cls, v):
        """Parse web contexts from JSON string."""
        return cls._parse_json_field_validator(v, 'web_contexts')

    @staticmethod
    def _parse_json_field_validator(v, field_name: str):
        """Helper method for parsing JSON fields in validators."""
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                return parsed if isinstance(parsed, list) else []
            except (json.JSONDecodeError, TypeError):
                logger.warning(f"Failed to parse {field_name}: invalid JSON")
                return []
        return v or []


class AITemplateExecute(BaseModel):
    """Schema for template execution requests."""
    template_id: str = Field(..., description="Template ID to execute")
    payload_data: Dict[str, str] = Field(..., description="Payload field values")
    override_temperature: Optional[float] = Field(None, description="Override temperature", ge=0.0, le=1.0)
    override_model: Optional[str] = Field(None, description="Override model", max_length=100)

    @field_validator('payload_data')
    @classmethod
    def validate_payload_data(cls, v):
        """Validate payload data structure."""
        if not isinstance(v, dict):
            raise ValueError('Payload data must be a dictionary')
        
        for key, value in v.items():
            if not isinstance(key, str):
                raise ValueError('Payload data keys must be strings')
            if not isinstance(value, str):
                raise ValueError('Payload data values must be strings')
            if len(key.strip()) == 0:
                raise ValueError('Payload data keys cannot be empty')
        
        return v

    @field_validator('override_model')
    @classmethod
    def validate_override_model(cls, v):
        """Validate override model."""
        if v and not v.strip():
            raise ValueError('Override model cannot be empty')
        return v.strip() if v else None


class TemplateExecutionResult(BaseModel):
    """Schema for template execution results."""
    result: str = Field(..., description="Execution result")
    template_id: str = Field(..., description="Executed template ID")
    model_used: str = Field(..., description="Model used for execution")
    temperature_used: float = Field(..., description="Temperature used for execution")
    execution_time_ms: Optional[int] = Field(None, description="Execution time in milliseconds")


class TemplateValidationError(BaseModel):
    """Schema for template validation errors."""
    field: str = Field(..., description="Field with validation error")
    message: str = Field(..., description="Error message")
    value: Optional[Any] = Field(None, description="Invalid value")


class TemplateListResponse(BaseModel):
    """Schema for template list responses."""
    templates: List[AITemplate] = Field(..., description="List of templates")
    total_count: int = Field(..., description="Total number of templates")
    page: int = Field(..., description="Current page number")
    page_size: int = Field(..., description="Number of items per page")
    has_next: bool = Field(..., description="Whether there are more pages")
