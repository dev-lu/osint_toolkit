from sqlalchemy import Boolean, Column, Integer, String
from database.database import Base


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