from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.core.settings.general.models.general_settings_models import Settings
from app.core.settings.general.crud.general_settings_crud import get_settings, update_settings, create_settings
from app.core.settings.general.schemas.general_settings_schemas import SettingsSchema
import logging


router = APIRouter()

@router.get("/api/settings/general/", response_model=list[SettingsSchema], tags=["Settings"])
def read_settings(db: Session = Depends(get_db)):
    settings = get_settings(db)
    if not settings:
        raise HTTPException(status_code=404, detail="No settings found")
    return settings


@router.put("/api/settings/general/", response_model=SettingsSchema, tags=["Settings"])
def update_settings(settings: SettingsSchema, db: Session = Depends(get_db)):
    existing_settings = get_settings(db)
    if existing_settings:
        updated_settings = update_settings(
            db, existing_settings[0].id, settings)
        return updated_settings
    else:
        create_settings(db, settings)


@router.put("/api/settings/general/darkmode/", response_model=SettingsSchema, tags=["Settings"])
def update_settings_darkmode(darkmode: bool, db: Session = Depends(get_db)):
    existing_settings = get_settings(db)
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


@router.put("/api/settings/general/font/", response_model=SettingsSchema, tags=["Settings"])
def update_settings_font(font: str, db: Session = Depends(get_db)):
    existing_settings = get_settings(db)
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