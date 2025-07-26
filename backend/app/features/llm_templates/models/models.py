import uuid
from sqlalchemy import Boolean, Column, String, JSON, Integer, Float, Text
from sqlalchemy.ext.hybrid import hybrid_property

from app.core.database import Base


class AITemplate(Base):
    """
    AI Template model for storing LLM prompt templates.
    
    This model stores all the necessary information for AI templates including
    the prompt structure, payload fields, contexts, and execution parameters.
    """
    
    __tablename__ = "ai_templates"
    
    id = Column(
        String, 
        primary_key=True, 
        default=lambda: str(uuid.uuid4()),
        comment="Unique identifier for the template"
    )
    
    title = Column(
        String(200), 
        nullable=False,
        comment="Human-readable template title"
    )
    
    description = Column(
        Text,
        nullable=True,
        comment="Detailed description of the template's purpose"
    )
    
    example_input_output = Column(
        Text,
        nullable=True,
        comment="Example showing expected input and output format"
    )
    
    ai_agent_role = Column(
        Text, 
        nullable=False,
        comment="System prompt defining the AI agent's role and persona"
    )
    
    ai_agent_task = Column(
        Text, 
        nullable=False,
        comment="Task prompt with instructions for the AI agent"
    )
    
    payload_fields = Column(
        JSON, 
        nullable=False,
        comment="JSON array defining required input fields for the template"
    )
    
    static_contexts = Column(
        JSON, 
        nullable=True, 
        default=list,
        comment="JSON array of static context information to include in prompts"
    )
    
    web_contexts = Column(
        JSON, 
        nullable=True, 
        default=list,
        comment="JSON array of web URLs to fetch and include as context"
    )
    
    is_public = Column(
        Boolean, 
        default=False,
        comment="Whether the template is publicly accessible"
    )
    
    user_id = Column(
        String(100), 
        nullable=True,
        comment="ID of the user who created the template"
    )
    
    order_number = Column(
        Integer, 
        nullable=True, 
        default=0,
        comment="Display order for template listing"
    )
    
    temperature = Column(
        Float, 
        nullable=True, 
        default=0.7,
        comment="LLM temperature setting (0.0-1.0) for response randomness"
    )
    
    model = Column(
        String(100), 
        nullable=True, 
        default="gpt-4",
        comment="Default LLM model to use for template execution"
    )
    
    def to_dict(self) -> dict:
        """
        Convert the template to a dictionary representation.
        
        Returns:
            Dictionary containing all template fields
        """
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'example_input_output': self.example_input_output,
            'ai_agent_role': self.ai_agent_role,
            'ai_agent_task': self.ai_agent_task,
            'payload_fields': self.payload_fields,
            'static_contexts': self.static_contexts,
            'web_contexts': self.web_contexts,
            'is_public': self.is_public,
            'user_id': self.user_id,
            'order_number': self.order_number,
            'temperature': self.temperature,
            'model': self.model
        }
    
    @hybrid_property
    def is_valid(self) -> bool:
        """
        Check if the template has all required fields for execution.
        
        Returns:
            True if template is valid for execution, False otherwise
        """
        return (
            bool(self.title and self.title.strip()) and
            bool(self.ai_agent_role and self.ai_agent_role.strip()) and
            bool(self.ai_agent_task and self.ai_agent_task.strip()) and
            self.payload_fields is not None
        )
    
    @hybrid_property
    def has_contexts(self) -> bool:
        """
        Check if the template has any context configurations.
        
        Returns:
            True if template has static or web contexts, False otherwise
        """
        return (
            (self.static_contexts and len(self.static_contexts) > 0) or
            (self.web_contexts and len(self.web_contexts) > 0)
        )
    
    def get_required_payload_fields(self) -> list:
        """
        Get list of required payload field names.
        
        Returns:
            List of field names that are marked as required
        """
        if not self.payload_fields:
            return []
        
        try:
            return [
                field.get('name') 
                for field in self.payload_fields 
                if field.get('required', False) and field.get('name')
            ]
        except (TypeError, AttributeError):
            return []
    
    def validate_payload_data(self, payload_data: dict) -> tuple[bool, list]:
        """
        Validate provided payload data against template requirements.
        
        Args:
            payload_data: Dictionary of payload field values
            
        Returns:
            Tuple of (is_valid, missing_fields)
        """
        required_fields = self.get_required_payload_fields()
        provided_fields = set(payload_data.keys()) if payload_data else set()
        missing_fields = [
            field for field in required_fields 
            if field not in provided_fields or not payload_data.get(field, '').strip()
        ]
        
        return len(missing_fields) == 0, missing_fields
    
    def __repr__(self) -> str:
        """String representation of the template."""
        return f"<AITemplate(id='{self.id}', title='{self.title}', public={self.is_public})>"
    
    def __str__(self) -> str:
        """Human-readable string representation."""
        return f"AI Template: {self.title} ({self.id})"
