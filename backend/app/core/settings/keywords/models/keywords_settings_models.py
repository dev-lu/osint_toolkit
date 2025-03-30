from sqlalchemy import Column, Integer, String
from app.core.database import Base


class Keyword(Base):
    __tablename__ = 'keywords'
    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String, unique=True, index=True)

    def to_dict(self):
        return {
            'id': self.id,
            'keyword': self.keyword,
        }