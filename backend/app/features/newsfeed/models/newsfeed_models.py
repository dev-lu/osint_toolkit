from sqlalchemy import Boolean, Column, Integer, String, DateTime, Text, JSON
from app.core.database import Base
import datetime
import json
import uuid

def generate_icon_id():
    return str(uuid.uuid4())

class NewsfeedSettings(Base):
    __tablename__ = "newsfeed_settings"
    name = Column(String, primary_key=True, index=True)
    url = Column(String)
    icon = Column(String, default='default.png')
    icon_id = Column(String, default=generate_icon_id)
    enabled = Column(Boolean, default=True)

    def to_dict(self):
        return {
            'name': self.name,
            'url': self.url,
            'icon': self.icon,
            'icon_id': self.icon_id,
            'enabled': self.enabled
        }

class NewsArticle(Base):
    __tablename__ = 'news_articles'
    id = Column(Integer, primary_key=True, index=True)
    feedname = Column(String)
    icon = Column(String)
    title = Column(String)
    summary = Column(String)
    full_text = Column(String)
    date = Column(DateTime)
    link = Column(String, unique=True, index=True)
    fetched_at = Column(DateTime, default=datetime.datetime.utcnow)
    matches = Column(Text, nullable=True)
    iocs = Column(Text, nullable=True)
    relevant_iocs = Column(Text, nullable=True)
    analysis_result = Column(Text, nullable=True)
    note = Column(Text, nullable=True)
    tlp = Column(String, default="TLP:CLEAR")
    read = Column(Boolean, default=False)

    def to_dict(self):
        if self.matches:
            try:
                matches_data = json.loads(self.matches)
                if not isinstance(matches_data, list):
                    matches_data = []
            except json.JSONDecodeError:
                matches_data = []
        else:
            matches_data = []
        
        if self.iocs:
            try:
                iocs_data = json.loads(self.iocs)
                if not isinstance(iocs_data, dict):
                    iocs_data = {}
            except json.JSONDecodeError:
                iocs_data = {}
        else:
            iocs_data = {}

        return {
            'id': self.id,
            'feedname': self.feedname,
            'icon': self.icon,
            'title': self.title,
            'summary': self.summary,
            'full_text': self.full_text,
            'date': self.date.isoformat() if self.date else None,
            'link': self.link,
            'fetched_at': self.fetched_at.isoformat() if self.fetched_at else None,
            'matches': matches_data,
            'iocs': iocs_data,
            'relevant_iocs': self.relevant_iocs,
            'analysis_result': self.analysis_result,
            'note': self.note,
            'tlp': self.tlp,
            'read': self.read
        }


class NewsfeedConfig(Base):
    __tablename__ = 'newsfeed_config'
    id = Column(Integer, primary_key=True, index=True)
    retention_days = Column(Integer, default=7)
    background_fetch_enabled = Column(Boolean, default=True)
    fetch_interval_minutes = Column(Integer, default=60)
    last_fetch_timestamp = Column(DateTime)
    keyword_matching_enabled = Column(Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'retention_days': self.retention_days,
            'background_fetch_enabled': self.background_fetch_enabled,
            'fetch_interval_minutes': self.fetch_interval_minutes,
            'last_fetch_timestamp': self.last_fetch_timestamp,
            'keyword_matching_enabled': self.keyword_matching_enabled
        }
