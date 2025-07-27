from sqlalchemy.orm import Session
from app.features.newsfeed.models.newsfeed_models import NewsfeedSettings, NewsArticle, NewsfeedConfig
from app.features.newsfeed.schemas.newsfeed_schemas import NewsfeedSettingsSchema, NewsArticleSchema, NewsfeedConfigSchema
from typing import Optional, List, Dict, Any
from collections import Counter, defaultdict
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
        from fastapi import HTTPException
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
            'iocs', 'relevant_iocs', 'matches', 'note', 'tlp', 'read', 'cves'
        })
    )
    logger.debug("Created NewsArticle object")
    
    db_news_article.matches = json.dumps(news_article.matches) if news_article.matches else None
    
    if isinstance(news_article.iocs, dict):
        db_news_article.iocs = json.dumps(news_article.iocs)
    else:
        db_news_article.iocs = None

    db_news_article.relevant_iocs = json.dumps(news_article.relevant_iocs) if news_article.relevant_iocs else None
    
    db_news_article.note = news_article.note
    db_news_article.tlp = news_article.tlp
    db_news_article.read = news_article.read

    try:
        logger.debug("Adding article to database session")
        db.add(db_news_article)
        db.commit()
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
        logger.info(f"Updating TLP to: {tlp}")
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


async def create_custom_feed(db: Session, settings: NewsfeedSettingsSchema):
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


async def create_custom_feed_with_favicon(db: Session, settings: NewsfeedSettingsSchema):
    """Add or update a custom newsfeed entry with favicon download if no icon provided."""
    from app.features.newsfeed.utils.favicon_downloader import FaviconDownloader
    
    if not settings.icon or settings.icon == "default.png":
        logger.info(f"No icon provided for feed {settings.name}, attempting to download favicon from {settings.url}")
        
        try:
            success, icon_filename, error = await FaviconDownloader.download_and_save_favicon(settings.url)
            if success and icon_filename:
                settings.icon = icon_filename
                settings.icon_id = icon_filename
                logger.info(f"Successfully downloaded favicon for {settings.name}: {icon_filename}")
            else:
                logger.warning(f"Failed to download favicon for {settings.name}: {error or 'Unknown error'}")
                settings.icon = "default.png"
                settings.icon_id = None
        except Exception as e:
            logger.warning(f"Exception during favicon download for {settings.name}: {str(e)}")
            settings.icon = "default.png"
            settings.icon_id = None
    
    return await create_custom_feed(db, settings)


async def delete_feed_icon_with_favicon_fallback(db: Session, feed_name: str):
    """Delete a feed's icon and try to download favicon before using default."""
    from app.features.newsfeed.utils.favicon_downloader import FaviconDownloader
    import os
    
    feed = db.query(NewsfeedSettings).filter(
        NewsfeedSettings.name == feed_name).first()
    
    if not feed:
        return False, "Feed not found"
    
    if feed.icon_id and feed.icon != "default.png":
        icon_path = os.path.join("app/static/feedicons", feed.icon_id)
        if os.path.exists(icon_path):
            try:
                os.remove(icon_path)
                logger.info(f"Removed existing icon file: {icon_path}")
            except Exception as e:
                logger.warning(f"Failed to remove icon file {icon_path}: {str(e)}")
    
    logger.info(f"Attempting to download favicon for {feed_name} from {feed.url}")
    try:
        success, icon_filename, error = await FaviconDownloader.download_and_save_favicon(feed.url)
        if success and icon_filename:
            feed.icon = icon_filename
            feed.icon_id = icon_filename
            db.commit()
            db.refresh(feed)
            logger.info(f"Successfully downloaded favicon for {feed_name}: {icon_filename}")
            return True, f"Icon deleted and favicon downloaded: {icon_filename}"
        else:
            logger.warning(f"Failed to download favicon for {feed_name}: {error}")
            feed.icon = "default.png"
            feed.icon_id = None
            db.commit()
            db.refresh(feed)
            return True, "Icon deleted, favicon download failed, using default icon"
    except Exception as e:
        logger.error(f"Error downloading favicon for {feed_name}: {str(e)}")
        feed.icon = "default.png"
        feed.icon_id = None
        db.commit()
        db.refresh(feed)
        return True, "Icon deleted, favicon download error, using default icon"


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
    try:
        cutoff_date = parse_time_range(time_filter)
    except ValueError:
        cutoff_date = datetime.utcnow() - timedelta(days=99999)

    if cutoff_date is None:
        cutoff_date = datetime.utcnow() - timedelta(days=99999)
    
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


def parse_time_range(time_range: str) -> Optional[datetime]:
    """
    Parse a relative time range string and return the corresponding cutoff date.
    Supports formats like '24h', '2d', '7d', '14d', '30d'.
    Returns None for invalid formats instead of raising an error directly.
    """
    if not time_range:
        return None
        
    time_range = time_range.lower()
    
    try:
        if time_range.endswith('h'):
            hours = int(time_range[:-1])
            return datetime.utcnow() - timedelta(hours=hours)
        elif time_range.endswith('d'):
            days = int(time_range[:-1])
            return datetime.utcnow() - timedelta(days=days)
        else:
            return None
    except ValueError:
        return None

def get_title_word_frequency(
    db: Session, 
    limit: int = 20,
    time_range: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> List[Dict[str, Any]]:
    """
    Analyze word frequency in article titles and return top occurring words.
    """
    query = db.query(
        NewsArticle.id,
        NewsArticle.title,
        NewsArticle.date
    )
    
    if time_range:
        cutoff_date = parse_time_range(time_range)
        if cutoff_date:
            query = query.filter(NewsArticle.date >= cutoff_date)
    elif start_date:
        query = query.filter(NewsArticle.date >= start_date)
        if end_date:
            query = query.filter(NewsArticle.date <= end_date)
    
    articles = query.all()
    
    word_articles = {}
    word_counts = Counter()
    
    stop_words = {
        "the", "and", "for", "with", "from", "that", "this", "have", "been", "has", "are",
        "was", "not", "but", "all", "its", "new", "more", "also", "into", "they", "their",
        "which", "could", "would", "should", "can", "will", "a", "an", "is", "of", "to", "in",
        "on", "at", "by", "be", "as", "or", "from", "it", "he", "she", "we", "you", "my",
        "your", "our", "us", "him", "her", "them", "his", "her", "its", "up", "down", "out",
        "about", "then", "there", "when", "where", "why", "how", "what", "who", "whom",
        "whose", "if", "than", "through", "before", "after", "while", "though", "even",
        "because", "until", "unless", "since", "about", "above", "across", "after", "against",
        "along", "among", "around", "at", "before", "behind", "below", "beneath", "beside",
        "between", "beyond", "but", "by", "concerning", "considering", "despite", "down",
        "during", "except", "for", "from", "in", "inside", "into", "like", "near", "of",
        "off", "on", "onto", "out", "outside", "over", "past", "regarding", "respecting",
        "round", "save", "since", "through", "throughout", "to", "toward", "towards", "under",
        "underneath", "until", "unto", "up", "upon", "with", "within", "without", "via", "re", 
        "hackers", "cyber", "attack", "attacks", "data", "security", "says", "cybersecurity",
        "cve", "threat", "unveils", "group", "spread", "globe", "threats", "four"
    }
    
    for article in articles:
        words = re.findall(r'\b[a-zA-Z]+\b', article.title.lower())
        
        for word in words:
            if word not in stop_words and len(word) > 2:
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


def get_top_iocs(db: Session, ioc_type: str, limit: int = 10, time_range: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Retrieves the most frequent IOCs of a specific type (e.g., IPs, Domains, Hashes)
    by parsing the 'iocs' JSON field within NewsArticle.
    """
    query = db.query(
        NewsArticle.id,
        NewsArticle.date,
        NewsArticle.iocs
    )

    if time_range:
        cutoff_date = parse_time_range(time_range)
        if cutoff_date:
            query = query.filter(NewsArticle.date >= cutoff_date)
    
    articles = query.all()
    
    ioc_articles = defaultdict(set)
    ioc_counts = Counter()
    
    for article in articles:
        iocs_json_str = article.iocs
        if iocs_json_str:
            try:
                iocs_data = json.loads(iocs_json_str)
                if ioc_type in iocs_data and isinstance(iocs_data[ioc_type], list):
                    for ioc_value in iocs_data[ioc_type]:
                        if isinstance(ioc_value, str) and ioc_value.strip():
                            ioc_articles[ioc_value].add(article.id)
                            ioc_counts[ioc_value] += 1
            except json.JSONDecodeError:
                logger.warning(f"Malformed JSON in 'iocs' column for article ID {article.id}: {iocs_json_str}")
                continue
            except TypeError as e:
                logger.warning(f"Unexpected data structure in 'iocs' column for article ID {article.id}. Error: {e}")
                continue
                
    top_iocs = ioc_counts.most_common(limit)
    
    result = [
        {
            "value": ioc_value,
            "count": count,
            "article_ids": list(ioc_articles[ioc_value])
        }
        for ioc_value, count in top_iocs
    ]
    
    return result


def get_top_cves(db: Session, limit: int = 10, time_range: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Retrieves the most frequent CVEs by parsing the 'iocs' JSON field within NewsArticle.
    """
    query = db.query(
        NewsArticle.id,
        NewsArticle.date,
        NewsArticle.iocs
    )

    if time_range:
        cutoff_date = parse_time_range(time_range)
        if cutoff_date:
            query = query.filter(NewsArticle.date >= cutoff_date)
    
    articles = query.all()
    
    cve_articles = defaultdict(set)
    cve_counts = Counter()
    
    for article in articles:
        iocs_json_str = article.iocs
        if iocs_json_str:
            try:
                iocs_data = json.loads(iocs_json_str)
                if 'cves' in iocs_data and isinstance(iocs_data['cves'], list):
                    for cve_value in iocs_data['cves']:
                        if isinstance(cve_value, str) and cve_value.strip():
                            cve_articles[cve_value].add(article.id)
                            cve_counts[cve_value] += 1
            except json.JSONDecodeError:
                logger.warning(f"Malformed JSON in 'iocs' column for article ID {article.id}: {iocs_json_str}")
                continue
            except TypeError as e:
                logger.warning(f"Unexpected data structure in 'iocs' column for article ID {article.id}. Error: {e}")
                continue

    top_cves = cve_counts.most_common(limit)
    
    result = [
        {
            "value": cve_value,
            "count": count,
            "article_ids": list(cve_articles[cve_value])
        }
        for cve_value, count in top_cves
    ]
    
    return result


def get_ioc_type_distribution(db: Session, time_range: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Retrieves the distribution (total count) of each IOC type within a specified time range.
    """
    query = db.query(
        NewsArticle.id,
        NewsArticle.date,
        NewsArticle.iocs
    )

    if time_range:
        cutoff_date = parse_time_range(time_range)
        if cutoff_date:
            query = query.filter(NewsArticle.date >= cutoff_date)
    
    articles = query.all()
    
    ioc_type_counts = Counter()
    
    for article in articles:
        iocs_json_str = article.iocs
        if iocs_json_str:
            try:
                iocs_data = json.loads(iocs_json_str)
                
                valid_ioc_types = ['ips', 'md5', 'sha1', 'sha256', 'urls', 'domains', 'emails', 'cves']
                
                for ioc_type in valid_ioc_types:
                    if ioc_type in iocs_data and isinstance(iocs_data[ioc_type], list):
                        ioc_type_counts[ioc_type] += len(iocs_data[ioc_type])
            except json.JSONDecodeError:
                logger.warning(f"Malformed JSON in 'iocs' column for article ID {article.id}: {iocs_json_str}")
                continue
            except TypeError as e:
                logger.warning(f"Unexpected data structure in 'iocs' column for article ID {article.id}. Error: {e}")
                continue

    result = [
        {
            "id": ioc_type,
            "label": ioc_type.replace('_', ' ').title(),
            "value": count
        }
        for ioc_type, count in ioc_type_counts.items()
    ]
    
    result.sort(key=lambda x: x['value'], reverse=True)
    return result
