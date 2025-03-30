from sqlalchemy.orm import Session
from app.core.settings.modules.models.modules_settings_models import ModuleSettings
from app.core.settings.modules.schemas.modules_settings_schemas import ModuleSettingsCreateSchema


def get_all_modules_settings(db: Session):
    return db.query(ModuleSettings).all()


def get_specific_module_setting(db: Session, module_name: str):
    return db.query(ModuleSettings).filter(ModuleSettings.name == module_name).first()


def update_module_setting(db: Session, setting: ModuleSettings, setting_input: ModuleSettingsCreateSchema):
    setting.enabled = setting_input.enabled
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

def get_keywords(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Keyword).offset(skip).limit(limit).all()


def create_keyword(db: Session, keyword: str):
    db_keyword = Keyword(keyword=keyword)
    db.add(db_keyword)
    db.commit()
    db.refresh(db_keyword)
    return db_keyword


def delete_keyword(db: Session, keyword_id: int):
    db_keyword = db.query(Keyword).filter(Keyword.id == keyword_id).first()
    if db_keyword:
        db.delete(db_keyword)
        db.commit()
        return True
    else:
        return false