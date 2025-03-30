from sqlalchemy import Boolean, Column, String
from app.core.database import Base


class ModuleSettings(Base):
    __tablename__ = "module_settings"
    name = Column(String, primary_key=True, index=True)
    enabled = Column(Boolean, default=True)

    def to_dict(self):
        return {
            'name': self.name,
            'enabled': self.enabled
        }