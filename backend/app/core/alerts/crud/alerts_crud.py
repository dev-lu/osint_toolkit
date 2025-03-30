from sqlalchemy.orm import Session
from database.models.alerts_model import Alert
from database.schemas.alerts_schema import AlertCreateSchema, AlertUpdateSchema
from datetime import datetime

def get_all_alerts(db: Session):
    return db.query(Alert).all()

def get_alert_by_id(db: Session, alert_id: int):
    return db.query(Alert).filter(Alert.id == alert_id).first()

def create_alert(db: Session, alert_data: AlertCreateSchema):
    new_alert = Alert(
        module=alert_data.module,
        title=alert_data.title,
        message=alert_data.message,
        read=False
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert

def mark_alert_as_read(db: Session, alert_id: int):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        alert.read = True
        alert.timestamp_read = datetime.utcnow()
        db.commit()
        db.refresh(alert)
    return alert

def mark_all_alerts_as_read(db: Session):
    alerts = db.query(Alert).filter(Alert.read == False).all()
    for alert in alerts:
        alert.read = True
        alert.timestamp_read = datetime.utcnow()
    db.commit()
    return alerts

def delete_alert(db: Session, alert_id: int):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    db.delete(alert)
    db.commit()
    return alert

def delete_all_alerts(db: Session):
    alerts = db.query(Alert).all()
    for alert in alerts:
        db.delete(alert)
    db.commit()
    return alerts
