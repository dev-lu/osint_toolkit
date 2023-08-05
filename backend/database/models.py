from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Sequence
from sqlalchemy.orm import relationship
from .database import Base


# Database model for the Apikey database
class Apikey(Base):
    __tablename__ = "apikeys"
    name = Column(String, unique=True, primary_key=True, index=True)
    key = Column(String, default="")
    is_active = Column(Boolean, default=False)

    def to_dict(self):
        return {
            'name': self.name,
            'key': self.key,
            'is_active': self.is_active
        }


# Database model for the Settings database
class Settings(Base):
    __tablename__ = 'settings'
    id = Column(Integer, primary_key=True)
    darkmode = Column(Boolean, default=False)
    font = Column(String, default='Poppins')

    def to_dict(self):
        return {
            'id': self.id,
            'darkmode': self.darkmode,
            'font': self.font
        }


class ModuleSettings(Base):
    __tablename__ = "module_settings"
    name = Column(String, primary_key=True, index=True)
    description = Column(String)
    enabled = Column(Boolean, default=True)

    def to_dict(self):
        return {
            # 'id': self.id,
            'name': self.name,
            'description': self.description,
            'enabled': self.enabled
        }


# Database model for the Newsfeed database
class NewsfeedSettings(Base):
    __tablename__ = "newsfeed_settings"
    # id = Column(Integer, primary_key=True, index=True)
    name = Column(String, primary_key=True, index=True)
    url = Column(String)
    icon = Column(String, default='default')
    enabled = Column(Boolean, default=True)

    def to_dict(self):
        return {
            # 'id': self.id,
            'name': self.name,
            'url': self.url,
            'icon': self.icon,
            'enabled': self.enabled
        }
