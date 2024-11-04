from pydantic import BaseModel


class ModuleSettingsSchema(BaseModel):
    name: str
    description: str = ""
    enabled: bool

    class Config:
        orm_mode = True


class ModuleSettingsCreateSchema(BaseModel):
    name: str
    description: str = ""
    enabled: bool


class ModuleSettingsStatusSchema(BaseModel):
    enabled: bool
