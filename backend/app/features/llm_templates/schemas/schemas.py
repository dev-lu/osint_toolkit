from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PayloadField(BaseModel):
    name: str
    description: str
    required: bool = True

class AITemplateBase(BaseModel):
    title: str
    description: Optional[str] = None
    example_input_output: Optional[str] = None
    ai_agent_role: str
    ai_agent_task: str
    payload_fields: List[Dict[str, Any]]
    is_public: bool = False

class AITemplateCreate(AITemplateBase):
    pass

class AITemplateUpdate(AITemplateBase):
    pass

class AITemplate(AITemplateBase):
    id: str
    user_id: Optional[str] = None

    class Config:
        from_attributes = True
"""
class AITemplateExecute(BaseModel):
    template_id: str
    payload_data: Dict[str, str] = Field(..., description="Key-value pairs of payload field names and their values")
"""
class AITemplateExecute(BaseModel):
    payload_data: Dict[str, Any]
    model_id: Optional[str] = Field(default="gpt-3.5", description="The ID of the model to use for execution")
    temperature: Optional[float] = Field(default=0.7, description="Temperature for model generation")
    max_tokens: Optional[int] = Field(default=1000, description="Maximum tokens for model response")