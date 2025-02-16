from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.dependencies import get_db
from database import crud, schemas


router = APIRouter()

@router.get("/api/settings/cti", response_model=schemas.CTISettingsSchema, tags=["Newsfeed"])
def get_cti_settings(db: Session = Depends(get_db)):
    cti_settings = crud.get_cti_settings(db)
    return cti_settings.to_dict()

@router.put("/api/settings/cti", response_model=schemas.CTISettingsSchema, tags=["Newsfeed"])
def update_cti_settings(settings_data: schemas.CTISettingsSchema, db: Session = Depends(get_db)):
    updated_cti_settings = crud.update_cti_settings(db, settings_data)
    return updated_cti_settings.to_dict()
