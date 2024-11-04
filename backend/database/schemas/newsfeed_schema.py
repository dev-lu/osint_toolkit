from pydantic import BaseModel
from typing import Optional, List
import datetime


class NewsfeedSettingsSchema(BaseModel):
    name: str
    url: str
    icon: str = "default_icon.png"
    enabled: bool = True

    class Config:
        orm_mode = True


class NewsfeedSettingsCreateSchema(BaseModel):
    name: str
    url: str
    enabled: bool


class NewsArticleSchema(BaseModel):
    id: Optional[int] = None
    feedname: str
    icon: str
    title: str
    summary: str
    date: datetime.datetime
    link: str
    fetched_at: datetime.datetime
    matches: Optional[List[str]] = None
    analysis_result: Optional[str] = None
    note: Optional[str] = None
    tlp: Optional[str] = "TLP:CLEAR"
    read: bool = False
    ips: Optional[List[str]] = []
    md5_hashes: Optional[List[str]] = []
    sha1_hashes: Optional[List[str]] = []
    sha256_hashes: Optional[List[str]] = []
    urls: Optional[List[str]] = []
    domains: Optional[List[str]] = []
    emails: Optional[List[str]] = []

    class Config:
        orm_mode = True

class NewsfeedConfigSchema(BaseModel):
    id: int
    retention_days: int
    background_fetch_enabled: bool
    fetch_interval_minutes: int
    last_fetch_timestamp: Optional[datetime.datetime]
    keyword_matching_enabled: bool = False

    class Config:
        orm_mode = True


class UpdateArticleRequest(BaseModel):
    note: Optional[str] = None
    tlp: Optional[str] = None
    read: Optional[bool] = None
