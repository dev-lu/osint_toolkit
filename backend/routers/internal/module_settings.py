from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.dependencies import get_db
from database import crud, schemas
from database.schemas import ModuleSettingsSchema, ModuleSettingsCreateSchema


router = APIRouter()

@router.get("/api/settings/modules/", response_model=list[schemas.ModuleSettingsSchema], tags=["Settings"])
def read_module_settings(db: Session = Depends(get_db)):
    settings = crud.get_all_modules_settings(db)
    if not settings:
        raise HTTPException(status_code=404, detail="No settings found")
    return [setting.to_dict() for setting in settings]

@router.post("/api/settings/modules/", response_model=ModuleSettingsCreateSchema, tags=["Settings"])
def create_module_setting(setting: ModuleSettingsCreateSchema, db: Session = Depends(get_db)):
    return crud.create_module_setting(db=db, settings=setting)

@router.put("/api/settings/modules", response_model=ModuleSettingsSchema, tags=["Settings"])
def update_module_setting(module_setting_input: ModuleSettingsCreateSchema, db: Session = Depends(get_db)):
    module_setting = crud.get_specific_module_setting(
        db=db, module_name=module_setting_input.name)
    if not module_setting:
        # raise HTTPException(status_code=404, detail="Module setting not found")
        return crud.create_module_setting(db=db, settings=module_setting_input)
    return crud.update_module_setting(db=db, setting=module_setting, setting_input=module_setting_input)


@router.post("/api/settings/modules/disable/", response_model=ModuleSettingsSchema, tags=["Settings"])
def disable_setting(module_name: str, db: Session = Depends(get_db)):
    module_setting = crud.disable_module(db=db, module_name=module_name)
    if not module_setting:
        raise HTTPException(status_code=404, detail="Module setting not found")
    module_setting.enabled = False
    db.commit()
    db.refresh(module_setting)
    return module_setting.to_dict()


@router.post("/api/settings/modules/enable/", response_model=ModuleSettingsSchema, tags=["Settings"])
def enable_setting(module_name: str, db: Session = Depends(get_db)):
    module_setting = crud.disable_module(db=db, module_name=module_name)
    if not module_setting:
        raise HTTPException(status_code=404, detail="Module setting not found")
    module_setting.enabled = True
    db.commit()
    db.refresh(module_setting)
    return module_setting.to_dict()


@router.delete("/api/settings/modules/{module_name}", response_model=ModuleSettingsSchema, tags=["Settings"])
def delete_module_setting(module_name: str, db: Session = Depends(get_db)):
    module_setting = crud.get_specific_module_setting(
        db=db, module_name=module_name)
    if not module_setting:
        raise HTTPException(status_code=404, detail="Module setting not found")
    return crud.delete_setting(db=db, setting_name=module_name)
