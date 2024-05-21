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
# Routes for internal API calls
# ===========================================================================
# Create API key


@router.post("/api/apikeys/", response_model=schemas.ApikeySchema, tags=["OSINT Toolkit modules"], status_code=status.HTTP_201_CREATED)
def create_apikey(apikey: schemas.ApikeySchema, db: Session = Depends(get_db)):
    existing_apikey = crud.get_apikey(db, apikey.name)
    if existing_apikey['name'] == "None":
        db_apikey = crud.create_apikey(db, apikey)
        logging.debug("Added API key: " + str(apikey))
        return db_apikey.to_dict()
    logging.error(
        "Could not add API key. API key already exists:  " + str(apikey))
    raise HTTPException(status_code=409, detail="Apikey already exists")


# Delete API key by name


@router.delete("/api/apikeys", response_model=schemas.DeleteApikeyResponse, tags=["OSINT Toolkit modules"])
def delete_apikey(name: str, db: Session = Depends(get_db)):
    apikey = crud.get_apikey(db, name)
    if apikey['name'] == "None" or not apikey:
        logging.error("Could not delete API key: API key not found")
        raise HTTPException(status_code=404, detail="API key not found")
    crud.delete_apikey(db=db, name=name)
    logging.info("Deleted API key: " + name)
    return schemas.DeleteApikeyResponse(apikey=schemas.ApikeySchema(**apikey), message="API key deleted successfully")

# Get all API keys
@router.get("/api/apikeys/", response_model=list[schemas.ApikeySchema], tags=["OSINT Toolkit modules"])
def read_apikeys(db: Session = Depends(get_db)):
    apikeys = crud.get_apikeys(db)
    if not apikeys:
        logging.error("Could not get API keys: No API keys found")
        raise HTTPException(status_code=404, detail="No API keys found")
    return [apikey.to_dict() for apikey in apikeys]

# Get API key by name


@router.get("/api/apikeys", response_model=schemas.ApikeySchema, tags=["OSINT Toolkit modules"])
def read_apikey(name: str, db: Session = Depends(get_db)):
    apikey = crud.get_apikey(db, name)
    if apikey is None:
        logging.error("Could not get API key. API key not found: " + name)
        raise HTTPException(status_code=404, detail="Apikey not found")
    return apikey

# Get all API keys state


@router.get("/api/apikeys/is_active", response_model=Dict[str, Any], tags=["OSINT Toolkit modules"])
def get_all_apikeys_is_active(db: Session = Depends(get_db)):
    apikeys = crud.get_apikeys(db)
    return {apikey.name: apikey.is_active for apikey in apikeys}

# Get specific API key state


@router.get("/api/apikeys/{name}/is_active", response_model=bool, tags=["OSINT Toolkit modules"])
def get_apikey_is_active(name: str, db: Session = Depends(get_db)):
    apikey = crud.get_apikey(db, name)
    if apikey is None:
        raise HTTPException(status_code=404, detail="Apikey not found")
    return apikey['is_active']

# Change API key state


@router.put("/api/apikeys/{name}/is_active", response_model=schemas.ApikeyStateResponse, tags=["OSINT Toolkit modules"])
def update_apikey_is_active(name: str, is_active: bool, db: Session = Depends(get_db)):
    apikey = crud.get_apikey(db, name)
    if apikey is None:
        raise HTTPException(status_code=404, detail="Apikey not found")
    apikey['is_active'] = is_active
    db.commit()
    return schemas.ApikeySchema(**apikey)

# (File is for smaller files)


@router.post("/api/extractor/", tags=["OSINT Toolkit modules"])
async def create_file(file: UploadFile = File(...)):
    try:
        file_contents = await file.read()
        result = ioc_extractor.extract_iocs(file_contents)
        return result
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

# (UploadFile is for larger files)


@router.post("/api/mailanalyzer/", tags=["OSINT Toolkit modules"])
async def create_upload_file(file: UploadFile):
    return email_analyzer.analyze_email(file.file.read())


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
