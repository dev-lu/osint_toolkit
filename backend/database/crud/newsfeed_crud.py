from sqlalchemy.orm import Session
from database.models import NewsfeedSettings, NewsArticle, NewsfeedConfig
from database.schemas import NewsfeedSettingsSchema, NewsArticleSchema, NewsfeedConfigSchema
from typing import Optional, List, Dict
from collections import Counter
from datetime import datetime, timedelta
import json
import re
import logging

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def get_newsfeed_settings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(NewsfeedSettings).offset(skip).limit(limit).all()


def create_newsfeed_settings(db: Session, settings: NewsfeedSettingsSchema):
    db_settings = NewsfeedSettings(**settings.dict())
    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings

def get_recent_news_articles(db: Session):
    """Retrieve the titles, IDs, and feed names of all news articles from the last 7 days."""
    cutoff_date = datetime.utcnow() - timedelta(days=712)
    recent_articles = db.query(
        NewsArticle.id,
        NewsArticle.title,
        NewsArticle.feedname
    ).filter(
        NewsArticle.date >= cutoff_date
    ).order_by(NewsArticle.date.desc()).all()
    
    return [
        {
            "id": article.id,
            "title": article.title,
            "feedname": article.feedname
        } for article in recent_articles
    ]


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
    
    if setting is None:
        raise HTTPException(
            status_code=404,
            detail=f"Newsfeed with name '{feedName}' not found"
        )
        
    setattr(setting, 'enabled', False)
    db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting


def get_news_articles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(NewsArticle).offset(skip).limit(limit).all()


def get_news_articles_by_retention(db: Session, retention_days: int):
    cutoff_date = datetime.utcnow() - timedelta(days=retention_days)
    return db.query(NewsArticle).filter(NewsArticle.date >= cutoff_date).all()


def create_news_article(db: Session, news_article: NewsArticleSchema):
    logger.debug("Attempting to create news article with data: %s", news_article.dict())
    
    db_news_article = NewsArticle(
        **news_article.dict(exclude={
            'iocs', 'relevant_iocs', 'matches', 'note', 'tlp', 'read'
        })
    )
    logger.debug("Created NewsArticle object")
    
    db_news_article.matches = json.dumps(news_article.matches) if news_article.matches else None
    db_news_article.iocs = json.dumps(news_article.iocs) if news_article.iocs else None
    db_news_article.relevant_iocs = json.dumps(news_article.relevant_iocs) if news_article.relevant_iocs else None
    db_news_article.note = news_article.note
    db_news_article.tlp = news_article.tlp
    db_news_article.read = news_article.read

    try:
        logger.debug("Adding article to database session")
        db.add(db_news_article)
        logger.debug("Committing database session")
        db.commit()
        logger.debug("Refreshing article object")
        db.refresh(db_news_article)
        logger.debug("Successfully created article with ID: %s", db_news_article.id)
        return db_news_article
    except Exception as e:
        logger.error("Error creating news article: %s", str(e))
        db.rollback()
        raise

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
    cutoff_date = datetime.utcnow() - timedelta(days=retention_days)
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

def get_newsfeed_retention_days(db: Session):
    config = get_newsfeed_config(db)
    if config:
        return config.retention_days
    else:
        return None

def set_retention_days(db: Session, new_retention_days: int):
    config = get_newsfeed_config(db)
    if not config:
        raise ValueError("No configuration found to update.")

    config_data = NewsfeedConfigSchema(
        retention_days=new_retention_days,
        background_fetch_enabled=config.background_fetch_enabled,
        fetch_interval_minutes=config.fetch_interval_minutes,
        last_fetch_timestamp=config.last_fetch_timestamp,
        keyword_matching_enabled=config.keyword_matching_enabled
    )
    
    updated_config = update_newsfeed_config(db, config_data)
    return updated_config


def get_news_article_by_id(db: Session, article_id: int):
    return db.query(NewsArticle).filter(NewsArticle.id == article_id).first()


def get_news_articles_by_ids(db: Session, article_ids: List[int]) -> List[NewsArticle]:
    """Get multiple news articles by their IDs."""
    return db.query(NewsArticle).filter(
        NewsArticle.id.in_(article_ids)
    ).all()


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


def get_recent_news_articles(db: Session, time_filter: str = "7d"):
    """Retrieve articles filtered by time range."""
    time_filters = {
        "8h": timedelta(hours=8),
        "24h": timedelta(days=1),
        "2d": timedelta(days=2),
        "7d": timedelta(days=7),
        "30d": timedelta(days=30)
    }
    
    cutoff_date = datetime.utcnow() - time_filters.get(time_filter, timedelta(days=99999))
    
    recent_articles = db.query(
        NewsArticle.id,
        NewsArticle.title,
        NewsArticle.feedname,
        NewsArticle.date
    ).filter(
        NewsArticle.date >= cutoff_date
    ).order_by(NewsArticle.date.desc()).all()
    
    return [
        {
            "id": article.id,
            "title": article.title,
            "feedname": article.feedname,
            "date": article.date.isoformat()
        } for article in recent_articles
    ]


def parse_time_range(time_range: str) -> datetime:
    """
    Parse a relative time range string and return the corresponding cutoff date.
    Supports formats like '24h', '2d', '7d', '14d', '30d'
    """
    if not time_range:
        return None
        
    time_range = time_range.lower()
    
    if time_range.endswith('h'):
        hours = int(time_range[:-1])
        return datetime.utcnow() - timedelta(hours=hours)
    elif time_range.endswith('d'):
        days = int(time_range[:-1])
        return datetime.utcnow() - timedelta(days=days)
    else:
        raise ValueError("Invalid time range format. Use '24h' for hours or '7d' for days")

def get_title_word_frequency(
    db: Session, 
    limit: int = 20,
    time_range: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> List[Dict[str, object]]:
    """
    Analyze word frequency in article titles and return top occurring words.
    
    Args:
        db: Database session
        limit: Maximum number of words to return
        time_range: Relative time range (e.g., '24h', '7d', '30d')
        start_date: Absolute start date for filtering
        end_date: Absolute end date for filtering (defaults to current time if not provided)
    
    Returns:
        List of dictionaries containing word frequencies and related article IDs
    """
    query = db.query(
        NewsArticle.id,
        NewsArticle.title,
        NewsArticle.date
    )
    
    if time_range:
        cutoff_date = parse_time_range(time_range)
        query = query.filter(NewsArticle.date >= cutoff_date)
    elif start_date:
        query = query.filter(NewsArticle.date >= start_date)
        if end_date:
            query = query.filter(NewsArticle.date <= end_date)
    
    articles = query.all()
    
    word_articles = {}  # word -> set of article IDs
    word_counts = Counter()  # word -> total count
    
    stop_words = {'your', 'day', 'out', 'users', 'vpn', 'time', 'was', 'that', 'hacking', 
                 'code', 'over', 'after', 'not', 'hackers', 'could', 'secure', 'attacks', 
                 'what', 'launches', 'newsletter', 'trust', 'the', 'a', 'an', 'and', 'or', 
                 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'data', 'new', 
                 'security', 'cybersecurity', 'how', 'cyber', 'from', 'year', 'why', 'you', 
                 'attack', 'its', 'says', 'are'}
    
    for article in articles:
        words = re.findall(r'\b[a-zA-Z]{3,}\b', article.title.lower())
        
        for word in words:
            if word not in stop_words:
                if word not in word_articles:
                    word_articles[word] = set()
                
                word_articles[word].add(article.id)
                word_counts[word] += 1
    
    top_words = word_counts.most_common(limit)
    
    result = [
        {
            "word": word,
            "count": count,
            "article_ids": list(word_articles[word])
        }
        for word, count in top_words
    ]
    
    return result