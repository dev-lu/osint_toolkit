from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.core.settings.cti_profile.schemas.cti_profile_settings_schemas import CTISettingsSchema
from app.core.settings.cti_profile.crud.cti_profile_settings_crud import get_cti_settings as crud_get_cti_settings
from app.core.settings.cti_profile.crud.cti_profile_settings_crud import update_cti_settings as crud_update_cti_settings


router = APIRouter()

@router.get("/api/settings/cti", response_model=CTISettingsSchema, tags=["Newsfeed"])
def get_cti_settings_route(db: Session = Depends(get_db)):
    """Retrieve CTI profile settings"""
    try:
        cti_settings = crud_get_cti_settings(db)
        return cti_settings.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving CTI settings: {str(e)}")

@router.put("/api/settings/cti", response_model=CTISettingsSchema, tags=["Newsfeed"])
def update_cti_settings_route(settings_data: CTISettingsSchema, db: Session = Depends(get_db)):
    """Update CTI profile settings"""
    try:
        updated_cti_settings = crud_update_cti_settings(db, settings_data)
        return updated_cti_settings.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating CTI settings: {str(e)}")
