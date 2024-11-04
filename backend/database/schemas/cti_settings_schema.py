from pydantic import BaseModel
from typing import Optional, Dict, Any


class CTISettingsSchema(BaseModel):
    id: Optional[int] = None
    settings: Dict[str, Any]

    class Config:
        orm_mode = True


