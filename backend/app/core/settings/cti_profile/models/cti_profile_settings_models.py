from sqlalchemy import Column, Integer, Text
from app.core.database import Base
import json


class CTISettings(Base):
    __tablename__ = 'cti_settings'
    id = Column(Integer, primary_key=True, index=True)
    settings = Column(Text)

    def to_dict(self):
        return {
            'id': self.id,
            'settings': json.loads(self.settings)
        }