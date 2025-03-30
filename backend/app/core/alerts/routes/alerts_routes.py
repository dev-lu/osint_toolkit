from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from sqlalchemy.orm import Session
from utils.dependencies import get_db
from database.crud import alerts_crud
from database.schemas import alerts_schema
from routers.internal.alerts_websocket import WebSocket
from routers.internal.alerts_websocket import manager

router = APIRouter()

@router.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # Keep connection open
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@router.get("/api/alerts/", response_model=list[alerts_schema.AlertSchema], tags=["Alerts"])
def read_alerts(db: Session = Depends(get_db)):
    alerts = alerts_crud.get_all_alerts(db)
    # Return an empty list if no alerts are found
    return alerts if alerts else []

@router.post("/api/alerts/", response_model=alerts_schema.AlertSchema, tags=["Alerts"])
async def create_alert(background_tasks: BackgroundTasks, alert: alerts_schema.AlertCreateSchema, db: Session = Depends(get_db)):
    new_alert = alerts_crud.create_alert(db, alert)
    
    # Use background tasks to broadcast the alert
    background_tasks.add_task(manager.broadcast, {
        "id": new_alert.id,
        "module": new_alert.module,
        "title": new_alert.title,
        "message": new_alert.message,
        "read": new_alert.read,
        "timestamp": new_alert.timestamp,
    })
    
    return new_alert


@router.put("/api/alerts/{alert_id}/read", response_model=alerts_schema.AlertSchema, tags=["Alerts"])
def mark_alert_as_read(alert_id: int, db: Session = Depends(get_db)):
    alert = alerts_crud.mark_alert_as_read(db, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.put("/api/alerts/read_all", tags=["Alerts"])
def mark_all_alerts_as_read(db: Session = Depends(get_db)):
    alerts = alerts_crud.mark_all_alerts_as_read(db)
    return {"message": "All alerts marked as read", "count": len(alerts)}

@router.delete("/api/alerts/{alert_id}", response_model=alerts_schema.AlertSchema, tags=["Alerts"])
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = alerts_crud.delete_alert(db, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.delete("/api/alerts/delete_all", tags=["Alerts"])
def delete_all_alerts(db: Session = Depends(get_db)):
    alerts_crud.delete_all_alerts(db)
    return {"message": "All alerts deleted"}
