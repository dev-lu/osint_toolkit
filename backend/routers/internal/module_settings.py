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
# Module settings routes
# ===========================================================================
# Get all module settings
@router.get("/api/settings/modules/", response_model=list[schemas.ModuleSettingsSchema], tags=["OSINT Toolkit modules"])
def read_module_settings(db: Session = Depends(get_db)):
    settings = crud.get_all_modules_settings(db)
    if not settings:
        raise HTTPException(status_code=404, detail="No settings found")
    return [setting.to_dict() for setting in settings]

# Create module setting


@router.post("/api/settings/modules/", response_model=ModuleSettingsCreateSchema, tags=["OSINT Toolkit modules"])
def create_module_setting(setting: ModuleSettingsCreateSchema, db: Session = Depends(get_db)):
    return crud.create_module_setting(db=db, settings=setting)

# Create or update module setting


@router.put("/api/settings/modules", response_model=ModuleSettingsSchema, tags=["OSINT Toolkit modules"])
def update_module_setting(module_setting_input: ModuleSettingsCreateSchema, db: Session = Depends(get_db)):
    module_setting = crud.get_specific_module_setting(
        db=db, module_name=module_setting_input.name)
    if not module_setting:
        # raise HTTPException(status_code=404, detail="Module setting not found")
        return crud.create_module_setting(db=db, settings=module_setting_input)
    return crud.update_module_setting(db=db, setting=module_setting, setting_input=module_setting_input)


@router.post("/api/settings/modules/disable/", response_model=ModuleSettingsSchema, tags=["OSINT Toolkit modules"])
def disable_setting(module_name: str, db: Session = Depends(get_db)):
    module_setting = crud.disable_module(db=db, module_name=module_name)
    if not module_setting:
        raise HTTPException(status_code=404, detail="Module setting not found")
    module_setting.enabled = False
    db.commit()
    db.refresh(module_setting)
    return module_setting.to_dict()


@router.post("/api/settings/modules/enable/", response_model=ModuleSettingsSchema, tags=["OSINT Toolkit modules"])
def enable_setting(module_name: str, db: Session = Depends(get_db)):
    module_setting = crud.disable_module(db=db, module_name=module_name)
    if not module_setting:
        raise HTTPException(status_code=404, detail="Module setting not found")
    module_setting.enabled = True
    db.commit()
    db.refresh(module_setting)
    return module_setting.to_dict()


@router.delete("/api/settings/modules/{module_name}", response_model=ModuleSettingsSchema, tags=["OSINT Toolkit modules"])
def delete_module_setting(module_name: str, db: Session = Depends(get_db)):
    module_setting = crud.get_specific_module_setting(
        db=db, module_name=module_name)
    if not module_setting:
        raise HTTPException(status_code=404, detail="Module setting not found")
    return crud.delete_setting(db=db, setting_name=module_name)
