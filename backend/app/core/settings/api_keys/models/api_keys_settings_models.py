from sqlalchemy import Boolean, Column, String
from app.core.database import Base


class Apikey(Base):
    __tablename__ = "apikeys"
    name = Column(String, unique=True, primary_key=True, index=True)
    key = Column(String, default="")
    is_active = Column(Boolean, default=False)
    bulk_ioc_lookup = Column(Boolean, default=False)

    def to_dict(self):
        """Returns the model as a dictionary."""
        return {
            'name': self.name,
            'key': self.key or "",
            'is_active': self.is_active,
            'bulk_ioc_lookup': self.bulk_ioc_lookup
        }
