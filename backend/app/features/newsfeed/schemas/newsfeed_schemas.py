from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import datetime


class NewsfeedSettingsSchema(BaseModel):
    name: str
    url: str
    icon: str = "default.png"
    icon_id: Optional[str] = None
    enabled: bool = True

    class Config:
        from_attributes = True


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
    full_text: Optional[str] = ''
    date: datetime.datetime
    link: str
    fetched_at: datetime.datetime
    matches: Optional[List[str]] = None
    iocs: Optional[Dict[str, List[str]]] = None
    relevant_iocs: Optional[List[str]] = None
    analysis_result: Optional[str] = None
    note: Optional[str] = None
    tlp: Optional[str] = "TLP:CLEAR"
    read: bool = False

    class Config:
        from_attributes = True

class NewsfeedConfigSchema(BaseModel):
    id: int
    retention_days: int
    background_fetch_enabled: bool
    fetch_interval_minutes: int
    last_fetch_timestamp: Optional[datetime.datetime]
    keyword_matching_enabled: bool = False

    class Config:
        from_attributes = True


class UpdateArticleRequest(BaseModel):
    note: Optional[str] = None
    tlp: Optional[str] = None
    read: Optional[bool] = None


class NewsAnalysisParams(BaseModel):
    """Parameters for customizing news article analysis"""
    model_id: str = Field(default="gpt-4o", description="Model ID to use for analysis")
    temperature: float = Field(default=0.3, description="Temperature for generation (0.0-1.0)")
    max_tokens: int = Field(default=2000, description="Maximum tokens for response")
    analyze_bias: bool = Field(default=True, description="Include bias assessment")
    analyze_missing_perspectives: bool = Field(default=True, description="Include missing perspectives")
    custom_focus: Optional[List[str]] = Field(default=None, description="Custom analysis focus areas")