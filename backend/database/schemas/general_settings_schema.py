from pydantic import BaseModel


class SettingsSchema(BaseModel):
    id: int
    darkmode: bool
    font: str

    class Config:
        from_attributes = True