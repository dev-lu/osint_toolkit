from sqlalchemy.orm import Session
from fastapi.exceptions import HTTPException
from app.core.settings.api_keys.models.api_keys_settings_models import Apikey
from app.core.settings.api_keys.schemas.api_keys_settings_schemas import ApikeySchema


def create_new_apikey(db: Session, apikey: ApikeySchema):
    db_apikey = Apikey(**apikey.dict())
    db.add(db_apikey)
    db.commit()
    db.refresh(db_apikey)
    return db_apikey


def get_apikeys(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Apikey).offset(skip).limit(limit).all()


def get_apikey(db: Session, name: str):
    key = db.query(Apikey).filter(Apikey.name == name).first()
    if key:
        return key.to_dict()
    return {"name": "None", "key": "", "is_active": False}


def delete_existing_apikey(db: Session, name: str):
    db_apikey = db.query(Apikey).filter(Apikey.name == name).first()
    db.delete(db_apikey)
    db.commit()
    return