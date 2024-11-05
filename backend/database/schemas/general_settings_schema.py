from pydantic import BaseModel


class SettingsSchema(BaseModel):
    id: int
    darkmode: bool
    font: str

    class Config:
        orm_mode = True