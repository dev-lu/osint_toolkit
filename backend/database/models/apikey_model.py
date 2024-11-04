from sqlalchemy import Boolean, Column, String
from database.database import Base


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