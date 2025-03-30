from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Alert(Base):
    __tablename__ = 'alerts'
    
    id = Column(Integer, primary_key=True)
    module = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    read = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    timestamp_read = Column(DateTime(timezone=True), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'module': self.module,
            'title': self.title,
            'message': self.message,
            'read': self.read,
            'timestamp': self.timestamp,
            'timestamp_read': self.timestamp_read,
        }
