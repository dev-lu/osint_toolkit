from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AlertBaseSchema(BaseModel):
    module: str
    title: str
    message: str

class AlertCreateSchema(AlertBaseSchema):
    pass

class AlertUpdateSchema(BaseModel):
    read: bool

class AlertSchema(AlertBaseSchema):
    id: int
    read: bool
    timestamp: datetime
    timestamp_read: Optional[datetime]

    class Config:
        from_attributes = True
