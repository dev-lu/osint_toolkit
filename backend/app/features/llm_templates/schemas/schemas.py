from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator

class PayloadField(BaseModel):
    name: str
    description: str
    required: bool = True

class StaticContext(BaseModel):
    name: str
    content: str
    description: Optional[str] = None

class AITemplateBase(BaseModel):
    title: str
    description: Optional[str] = None
    example_input_output: Optional[str] = None
    ai_agent_role: str
    ai_agent_task: str
    payload_fields: List[Dict[str, Any]]
    static_contexts: Optional[List[Dict[str, Any]]] = []
    is_public: bool = False
    order_number: Optional[int] = 0
    temperature: Optional[float] = 0.7
    model: Optional[str] = "gpt-4"

    @validator('temperature')
    def validate_temperature(cls, v):
        if v is not None and (v < 0.0 or v > 1.0):
            raise ValueError('Temperature must be between 0.0 and 1.0')
        return v

class AITemplateCreate(AITemplateBase):
    pass

class AITemplateUpdate(AITemplateBase):
    pass

class AITemplate(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    example_input_output: Optional[str] = None
    ai_agent_role: str
    ai_agent_task: str
    payload_fields: Any 
    static_contexts: Any
    is_public: bool = False
    user_id: Optional[str] = None
    order_number: Optional[int] = 0
    temperature: Optional[float] = 0.7
    model: Optional[str] = "gpt-4"

    # Property methods to handle JSON string conversion
    @property
    def parsed_payload_fields(self) -> List[Dict[str, Any]]:
        if isinstance(self.payload_fields, str):
            try:
                return json.loads(self.payload_fields)
            except (json.JSONDecodeError, TypeError):
                return []
        return self.payload_fields or []

    @property
    def parsed_static_contexts(self) -> List[Dict[str, Any]]:
        if isinstance(self.static_contexts, str):
            try:
                return json.loads(self.static_contexts)
            except (json.JSONDecodeError, TypeError):
                return []
        return self.static_contexts or []

    class Config:
        from_attributes = True
        
    # Model serialization
    def dict(self, *args, **kwargs):
        base_dict = super().dict(*args, **kwargs)
        # Replace with parsed versions
        base_dict['payload_fields'] = self.parsed_payload_fields
        base_dict['static_contexts'] = self.parsed_static_contexts
        return base_dict

class AITemplateOutput(AITemplateBase):
    id: str
    user_id: Optional[str] = None
    
    @validator('payload_fields', pre=True)
    def parse_payload_fields(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return []
        return v
    
    @validator('static_contexts', pre=True)
    def parse_static_contexts(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return []
        return v

class AITemplateExecute(BaseModel):
    template_id: str
    payload_data: Dict[str, str] = Field(..., description="Key-value pairs of payload field names and their values")
    override_temperature: Optional[float] = None
    override_model: Optional[str] = None

    @validator('override_temperature')
    def validate_override_temperature(cls, v):
        if v is not None and (v < 0.0 or v > 1.0):
            raise ValueError('Temperature must be between 0.0 and 1.0')
        return v