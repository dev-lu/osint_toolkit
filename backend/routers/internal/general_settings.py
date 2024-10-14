from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from dependencies import get_db
from database import crud, models, schemas
from database.database import engine
from database.models import Settings
from database.schemas import ModuleSettingsSchema, ModuleSettingsCreateSchema
import ioc_extractor
import email_analyzer
import logging
from typing import Dict, Any

router = APIRouter()
models.Base.metadata.create_all(bind=engine)

# ===========================================================================
# General settings routes
# ===========================================================================
# Get all Settings
@router.get("/api/settings/general/", response_model=list[schemas.SettingsSchema], tags=["OSINT Toolkit modules"])
def read_settings(db: Session = Depends(get_db)):
    settings = crud.get_settings(db)
    if not settings:
        raise HTTPException(status_code=404, detail="No settings found")
    return settings


@router.put("/api/settings/general/", response_model=schemas.SettingsSchema, tags=["OSINT Toolkit modules"])
def update_settings(settings: schemas.SettingsSchema, db: Session = Depends(get_db)):
    existing_settings = crud.get_settings(db)
    if existing_settings:
        # update the existing settings
        updated_settings = crud.update_settings(
            db, existing_settings[0].id, settings)
        return updated_settings
    else:
        crud.create_settings(db, settings)


@router.put("/api/settings/general/darkmode/", response_model=schemas.SettingsSchema, tags=["OSINT Toolkit modules"])
def update_settings_darkmode(darkmode: bool, db: Session = Depends(get_db)):
    existing_settings = crud.get_settings(db)
    if existing_settings:
        # update the existing settings
        existing_settings[0].darkmode = darkmode
        db.commit()
        db.refresh(existing_settings[0])
        return existing_settings[0].to_dict()
    else:
        # create new settings
        new_settings = Settings(darkmode=darkmode)
        db.add(new_settings)
        db.commit()
        db.refresh(new_settings)
        return new_settings.to_dict()


@router.put("/api/settings/general/font/", response_model=schemas.SettingsSchema, tags=["OSINT Toolkit modules"])
def update_settings_font(font: str, db: Session = Depends(get_db)):
    existing_settings = crud.get_settings(db)
    if existing_settings:
        # update the existing settings
        existing_settings[0].font = font
        db.commit()
        db.refresh(existing_settings[0])
        return existing_settings[0].to_dict()
    else:
        # create new settings
        new_settings = Settings(font=font)
        db.add(new_settings)
        db.commit()
        db.refresh(new_settings)
        return new_settings.to_dict()