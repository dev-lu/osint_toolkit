from sqlalchemy.orm import Session
from database.models import CTISettings
from database.schemas import CTISettingsSchema
import json


def get_cti_settings(db: Session):
    cti_settings = db.query(CTISettings).first()
    if not cti_settings:
        cti_settings = CTISettings(settings=json.dumps({}))
        db.add(cti_settings)
        db.commit()
        db.refresh(cti_settings)
    return cti_settings


def update_cti_settings(db: Session, settings_data: CTISettingsSchema):
    cti_settings = db.query(CTISettings).first()
    if cti_settings:
        cti_settings.settings = json.dumps(settings_data.settings)
        db.commit()
        db.refresh(cti_settings)
    else:
        cti_settings = CTISettings(settings=json.dumps(settings_data.settings))
        db.add(cti_settings)
        db.commit()
        db.refresh(cti_settings)
    return cti_settings
