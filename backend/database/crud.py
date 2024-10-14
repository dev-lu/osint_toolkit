from sqlalchemy.orm import Session
from fastapi.exceptions import HTTPException
from .models import Apikey, Settings, ModuleSettings, NewsfeedSettings
from .schemas import ApikeySchema, SettingsSchema, NewsfeedSettingsSchema, ModuleSettingsCreateSchema

# ===========================================================================
# API key settings CRUD operations
# ===========================================================================
def create_apikey(db: Session, apikey: ApikeySchema):
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


def delete_apikey(db: Session, name: str):
    db_apikey = db.query(Apikey).filter(Apikey.name == name).first()
    db.delete(db_apikey)
    db.commit()
    return


# ===========================================================================
# Module settings CRUD operations
# ===========================================================================
def get_all_modules_settings(db: Session):
    return db.query(ModuleSettings).all()


def get_specific_module_setting(db: Session, module_name: str):
    return db.query(ModuleSettings).filter(ModuleSettings.name == module_name).first()


def update_module_setting(db: Session, setting: ModuleSettings, setting_input: ModuleSettingsCreateSchema):
    setattr(setting, 'name', setting_input.name)
    setattr(setting, 'description', setting_input.description)
    setattr(setting, 'enabled', setting_input.enabled)
    db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting


def disable_module(db: Session, module_name: str):
    setting = db.query(ModuleSettings).filter(
        ModuleSettings.name == module_name).first()
    setattr(setting, 'enabled', False)
    db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting


def create_module_setting(db: Session, settings: ModuleSettingsCreateSchema):
    data = ModuleSettings(
        name=settings.name,
        description=settings.description,
        enabled=True
    )
    db.add(data)
    db.commit()
    db.refresh(data)
    return data.to_dict()


def delete_setting(db: Session, setting_name: str):
    setting = db.query(ModuleSettings).filter(
        ModuleSettings.name == setting_name).first()
    db.delete(setting)
    db.commit()
    return setting


# ===========================================================================
# General settings CRUD operations
# ===========================================================================
def get_settings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Settings).offset(skip).limit(limit).all()


def create_settings(db: Session, settings: SettingsSchema):
    db_settings = Settings(**settings.dict())
    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings


def update_settings(db: Session, id: int, settings: SettingsSchema):
    db_settings = db.query(Settings).filter(Settings.id == id).first()
    if db_settings:
        db_settings.darkmode = settings.darkmode
        db_settings.font = settings.font
        db.commit()
        db.refresh(db_settings)
        return db_settings
    else:
        raise HTTPException(status_code=404, detail="Settings not found")


# ===========================================================================
# Newsfeeds (RSS) CRUD operations
# ===========================================================================
def get_newsfeed_settings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(NewsfeedSettings).offset(skip).limit(limit).all()


def create_newsfeed_settings(db: Session, settings: NewsfeedSettingsSchema):
    db_settings = NewsfeedSettings(**settings.dict())
    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings


def update_newsfeed_settings(db: Session, name: str, settings: NewsfeedSettingsSchema):
    db_settings = db.query(NewsfeedSettings).filter(
        NewsfeedSettings.name == name).first()
    if db_settings:
        # db_settings.id = settings.id
        db_settings.name = settings.name
        db_settings.url = settings.url
        db_settings.icon = settings.icon
        db_settings.enabled = settings.enabled
        db.commit()
        db.refresh(db_settings)
        return db_settings
    else:
        create_newsfeed_settings(db, settings)
        return db_settings


def delete_newsfeed_settings(db: Session, id: int):
    db_settings = db.query(NewsfeedSettings).filter(
        NewsfeedSettings.name == id).first()
    if db_settings:
        db.delete(db_settings)
        db.commit()
        return True
    else:
        return None


def disable_feed(db: Session, feedName: str):
    setting = db.query(NewsfeedSettings).filter(
        NewsfeedSettings.name == feedName).first()
    setattr(setting, 'enabled', False)
    db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting
