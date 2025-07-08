from sqlalchemy import Boolean, Column, String, JSON, Integer, Float
from app.core.database import Base
import uuid

class AITemplate(Base):
    __tablename__ = "ai_templates"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(String)
    example_input_output = Column(String)
    ai_agent_role = Column(String, nullable=False)
    ai_agent_task = Column(String, nullable=False)
    payload_fields = Column(JSON, nullable=False)
    static_contexts = Column(JSON, nullable=True, default=[])
    is_public = Column(Boolean, default=False)
    user_id = Column(String, nullable=True)
    order_number = Column(Integer, nullable=True, default=0)
    temperature = Column(Float, nullable=True, default=0.7)
    model = Column(String, nullable=True, default="gpt-4")
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'example_input_output': self.example_input_output,
            'ai_agent_role': self.ai_agent_role,
            'ai_agent_task': self.ai_agent_task,
            'payload_fields': self.payload_fields,
            'static_contexts': self.static_contexts,
            'is_public': self.is_public,
            'user_id': self.user_id,
            'order_number': self.order_number,
            'temperature': self.temperature,
            'model': self.model
        }