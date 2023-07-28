from pydantic import BaseModel, validator
from typing import List, Optional, Dict, Union
from .models import Settings as SettingsModel


# ===========================================================================
# API key settings
# ===========================================================================
class ApikeySchema(BaseModel):
    name: str
    key: str = ""
    is_active: bool = False


class DeleteApikeyResponse(BaseModel):
    apikey: ApikeySchema
    message: str


class ApikeyStateResponse(BaseModel):
    name: str


# ===========================================================================
# General settings
# ===========================================================================
class SettingsSchema(BaseModel):
    id: int
    darkmode: bool
    proxy_string: str
    proxy_enabled: bool
    font: str

    class Config:
        orm_mode = True


# ===========================================================================
# Module settings
# ===========================================================================
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


# ===========================================================================
# Newsfeeds (RSS)
# ===========================================================================
class NewsfeedSettingsSchema(BaseModel):
    # id: int
    name: str
    url: str
    icon: str
    enabled: bool

    class Config:
        orm_mode = True


class NewsfeedSettingsCreateSchema(BaseModel):
    name: str
    url: str
    enabled: bool
