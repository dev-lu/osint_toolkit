from sqlalchemy import Boolean, Column, String, JSON
from database.database import Base
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
    is_public = Column(Boolean, default=False)
    user_id = Column(String, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'example_input_output': self.example_input_output,
            'ai_agent_role': self.ai_agent_role,
            'ai_agent_task': self.ai_agent_task,
            'payload_fields': self.payload_fields,
            'is_public': self.is_public,
            'user_id': self.user_id
        }
