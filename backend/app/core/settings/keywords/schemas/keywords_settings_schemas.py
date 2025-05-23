from pydantic import BaseModel
from typing import Optional


class KeywordSchema(BaseModel):
    id: Optional[int] = None
    keyword: str

    class Config:
        from_attributes = True