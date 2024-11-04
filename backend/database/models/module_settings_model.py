from sqlalchemy import Boolean, Column, String
from database.database import Base


class ModuleSettings(Base):
    __tablename__ = "module_settings"
    name = Column(String, primary_key=True, index=True)
    description = Column(String)
    enabled = Column(Boolean, default=True)

    def to_dict(self):
        return {
            'name': self.name,
            'description': self.description,
            'enabled': self.enabled
        }