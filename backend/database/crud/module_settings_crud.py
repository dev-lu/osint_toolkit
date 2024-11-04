from sqlalchemy.orm import Session
from database.models import ModuleSettings
from database.schemas import ModuleSettingsCreateSchema


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