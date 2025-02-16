from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.dependencies import get_db
from database import crud, schemas
from database.models import Settings
import logging


router = APIRouter()

@router.get("/api/settings/general/", response_model=list[schemas.SettingsSchema], tags=["Settings"])
def read_settings(db: Session = Depends(get_db)):
    settings = crud.get_settings(db)
    if not settings:
        raise HTTPException(status_code=404, detail="No settings found")
    return settings


@router.put("/api/settings/general/", response_model=schemas.SettingsSchema, tags=["Settings"])
def update_settings(settings: schemas.SettingsSchema, db: Session = Depends(get_db)):
    existing_settings = crud.get_settings(db)
    if existing_settings:
        updated_settings = crud.update_settings(
            db, existing_settings[0].id, settings)
        return updated_settings
    else:
        crud.create_settings(db, settings)


@router.put("/api/settings/general/darkmode/", response_model=schemas.SettingsSchema, tags=["Settings"])
def update_settings_darkmode(darkmode: bool, db: Session = Depends(get_db)):
    existing_settings = crud.get_settings(db)
    if existing_settings:
        existing_settings[0].darkmode = darkmode
        db.commit()
        db.refresh(existing_settings[0])
        return existing_settings[0].to_dict()
    else:
        new_settings = Settings(darkmode=darkmode)
        db.add(new_settings)
        db.commit()
        db.refresh(new_settings)
        return new_settings.to_dict()


@router.put("/api/settings/general/font/", response_model=schemas.SettingsSchema, tags=["Settings"])
def update_settings_font(font: str, db: Session = Depends(get_db)):
    existing_settings = crud.get_settings(db)
    if existing_settings:
        existing_settings[0].font = font
        db.commit()
        db.refresh(existing_settings[0])
        return existing_settings[0].to_dict()
    else:
        new_settings = Settings(font=font)
        db.add(new_settings)
        db.commit()
        db.refresh(new_settings)
        return new_settings.to_dict()