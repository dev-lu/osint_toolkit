from sqlalchemy.orm import Session
from fastapi.exceptions import HTTPException
from database.models import Settings
from database.schemas import SettingsSchema


def get_settings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Settings).offset(skip).limit(limit).all()


def create_settings(db: Session, settings: SettingsSchema):
    db_settings = Settings(**settings.dict())
    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings


def update_settings(db: Session, id: int, settings: SettingsSchema):
    db_settings = db.query(Settings).filter(Settings.id == id).first()
    if db_settings:
        db_settings.darkmode = settings.darkmode
        db_settings.font = settings.font
        db.commit()
        db.refresh(db_settings)
        return db_settings
    else:
        raise HTTPException(status_code=404, detail="Settings not found")
