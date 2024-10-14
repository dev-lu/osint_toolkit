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
# Newsfeed settings routes
# ===========================================================================
# Get newsfeed settings
@router.get("/api/settings/modules/newsfeed/", response_model=list[schemas.NewsfeedSettingsSchema], tags=["OSINT Toolkit modules"])
def read_newsfeed_settings(db: Session = Depends(get_db)):
    settings = crud.get_newsfeed_settings(db)
    if not settings:
        raise HTTPException(status_code=404, detail="No settings found")
    return [setting.to_dict() for setting in settings]

# Create or update newsfeed settings
@router.put("/api/settings/modules/newsfeed/", response_model=schemas.NewsfeedSettingsSchema, tags=["OSINT Toolkit modules"])
def update_newsfeed_settings(settings: schemas.NewsfeedSettingsSchema, db: Session = Depends(get_db)):
    updated_settings = crud.update_newsfeed_settings(
        db, settings.name, settings)
    return updated_settings
    # settings_schema = schemas.NewsfeedSettingsSchema(**settings.dict())

# Delete Newsfeed
@router.delete("/api/settings/modules/newsfeed/{id}", response_model=schemas.NewsfeedSettingsSchema, tags=["OSINT Toolkit modules"])
def delete_newsfeed_settings(id: int, db: Session = Depends(get_db)):
    deleted_newsfeed = crud.delete_newsfeed_settings(db, id)
    if not deleted_newsfeed:
        raise HTTPException(status_code=404, detail="Newsfeed not found")
    return {'Success': 'Newsfeed deleted'}


@router.post("/api/settings/modules/newsfeed/enable", response_model=schemas.NewsfeedSettingsSchema, tags=["OSINT Toolkit modules"])
def enable_newsfeed(feedName: str, db: Session = Depends(get_db)):
    newsfeed_state = crud.disable_feed(db=db, feedName=feedName)
    if not newsfeed_state:
        raise HTTPException(status_code=404, detail="Newsfeed not found")
    newsfeed_state.enabled = True
    db.commit()
    db.refresh(newsfeed_state)
    return newsfeed_state.to_dict()


@router.post("/api/settings/modules/newsfeed/disable", response_model=schemas.NewsfeedSettingsSchema, tags=["OSINT Toolkit modules"])
def disable_newsfeed(feedName: str, db: Session = Depends(get_db)):
    newsfeed_state = crud.disable_feed(db=db, feedName=feedName)
    if not newsfeed_state:
        raise HTTPException(status_code=404, detail="Newsfeed not found")
    newsfeed_state.enabled = False
    db.commit()
    db.refresh(newsfeed_state)
    return newsfeed_state.to_dict()

@router.get("/api/settings/newsfeed/retention", response_model=int)
def get_retention_days(db: Session = Depends(get_db)):
    return crud.get_newsfeed_retention_days(db)

@router.put("/api/settings/newsfeed/retention")
def update_retention_days(days: int, db: Session = Depends(get_db)):
    return crud.update_newsfeed_retention_days(db, days)