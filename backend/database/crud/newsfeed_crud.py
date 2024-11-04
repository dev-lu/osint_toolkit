from sqlalchemy.orm import Session
from database.models import NewsfeedSettings, NewsArticle, NewsfeedConfig
from database.schemas import NewsfeedSettingsSchema, NewsArticleSchema, NewsfeedConfigSchema
from typing import Optional
import datetime
import json


def get_newsfeed_settings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(NewsfeedSettings).offset(skip).limit(limit).all()


def create_newsfeed_settings(db: Session, settings: NewsfeedSettingsSchema):
    db_settings = NewsfeedSettings(**settings.dict())
    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings


def update_newsfeed_settings(db: Session, name: str, settings: NewsfeedSettingsSchema):
    db_settings = db.query(NewsfeedSettings).filter(
        NewsfeedSettings.name == name).first()
    if db_settings:
        # db_settings.id = settings.id
        db_settings.name = settings.name
        db_settings.url = settings.url
        db_settings.icon = settings.icon
        db_settings.enabled = settings.enabled
        db.commit()
        db.refresh(db_settings)
        return db_settings
    else:
        create_newsfeed_settings(db, settings)
        return db_settings


def delete_newsfeed_settings(db: Session, feedName: str):
    db_settings = db.query(NewsfeedSettings).filter(
        NewsfeedSettings.name == feedName).first()
    if db_settings:
        db.delete(db_settings)
        db.commit()
        return True
    else:
        return None


def disable_feed(db: Session, feedName: str):
    setting = db.query(NewsfeedSettings).filter(
        NewsfeedSettings.name == feedName).first()
    setattr(setting, 'enabled', False)
    db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting


def get_news_articles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(NewsArticle).offset(skip).limit(limit).all()


def get_news_articles_by_retention(db: Session, retention_days: int):
    cutoff_date = datetime.datetime.utcnow() - datetime.timedelta(days=retention_days)
    return db.query(NewsArticle).filter(NewsArticle.date >= cutoff_date).all()


def create_news_article(db: Session, news_article: NewsArticleSchema):
    db_news_article = NewsArticle(
        **news_article.dict(exclude={
            'matches', 'ips', 'md5_hashes', 'sha1_hashes', 'sha256_hashes',
            'urls', 'domains', 'emails', 'note', 'tlp', 'read'
        })
    )
    db_news_article.matches = json.dumps(news_article.matches) if news_article.matches else None
    db_news_article.ips = news_article.ips
    db_news_article.md5_hashes = news_article.md5_hashes
    db_news_article.sha1_hashes = news_article.sha1_hashes
    db_news_article.sha256_hashes = news_article.sha256_hashes
    db_news_article.urls = news_article.urls
    db_news_article.domains = news_article.domains
    db_news_article.emails = news_article.emails
    db_news_article.note = news_article.note
    db_news_article.tlp = news_article.tlp
    db_news_article.read = news_article.read

    db.add(db_news_article)
    db.commit()
    db.refresh(db_news_article)
    return db_news_article

def update_news_article(db: Session, article_id: int, note: Optional[str] = None, tlp: Optional[str] = None, read: Optional[bool] = None):
    db_news_article = db.query(NewsArticle).filter(NewsArticle.id == article_id).first()
    if not db_news_article:
        return None

    if note is not None:
        db_news_article.note = note
    if tlp is not None:
        print(f"Updating TLP to: {tlp}")
        db_news_article.tlp = tlp
    if read is not None:
        db_news_article.read = read

    db.commit()
    db.refresh(db_news_article)
    return db_news_article



def delete_old_news_articles(db: Session, retention_days: int):
    cutoff_date = datetime.datetime.utcnow() - datetime.timedelta(days=retention_days)
    db.query(NewsArticle).filter(NewsArticle.date < cutoff_date).delete()
    db.commit()


def news_article_exists(db: Session, link: str):
    return db.query(NewsArticle).filter(NewsArticle.link == link).first() is not None


def get_newsfeed_config(db: Session):
    config = db.query(NewsfeedConfig).first()
    if not config:
        config = NewsfeedConfig()
        db.add(config)
        db.commit()
        db.refresh(config)
    return config


def update_newsfeed_config(db: Session, config_data: NewsfeedConfigSchema):
    config = get_newsfeed_config(db)
    config.retention_days = config_data.retention_days
    config.background_fetch_enabled = config_data.background_fetch_enabled
    config.fetch_interval_minutes = config_data.fetch_interval_minutes
    config.last_fetch_timestamp = config_data.last_fetch_timestamp
    config.keyword_matching_enabled = config_data.keyword_matching_enabled
    db.commit()
    db.refresh(config)
    return config


def get_news_article_by_id(db: Session, article_id: int):
    return db.query(NewsArticle).filter(NewsArticle.id == article_id).first()


def create_custom_feed(db: Session, settings: NewsfeedSettingsSchema):
    """Add or update a custom newsfeed entry."""
    existing_feed = db.query(NewsfeedSettings).filter(
        NewsfeedSettings.name == settings.name).first()
    if existing_feed:
        existing_feed.url = settings.url
        existing_feed.icon = settings.icon
        existing_feed.enabled = bool(settings.enabled)
        db.commit()
        db.refresh(existing_feed)
        return existing_feed
    else:
        db_feed = NewsfeedSettings(
            name=settings.name,
            url=settings.url,
            icon=settings.icon,
            enabled=bool(settings.enabled)
        )
        db.add(db_feed)
        db.commit()
        db.refresh(db_feed)
        return db_feed


def delete_custom_feed(db: Session, name: str):
    """Delete a custom newsfeed entry by name."""
    db_feed = db.query(NewsfeedSettings).filter(
        NewsfeedSettings.name == name).first()
    if db_feed:
        db.delete(db_feed)
        db.commit()
        return True
    return None
