from pydantic import BaseModel


class ModuleSettingsSchema(BaseModel):
    name: str
    enabled: bool = True

    class Config:
        from_attributes = True


class ModuleSettingsCreateSchema(BaseModel):
    name: str
    enabled: bool


class ModuleSettingsStatusSchema(BaseModel):
    enabled: bool
