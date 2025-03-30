from fastapi import BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
import asyncio
from datetime import datetime, timedelta
import regex as re
from typing import List, Dict, Optional, Tuple, Any
import logging
import time
import os
from urllib.parse import urlparse
from openai import OpenAI
import aiohttp
from PIL import Image
import io

from app.features.newsfeed.schemas.newsfeed_schemas import NewsArticleSchema
from app.features.newsfeed.models.newsfeed_models import (
    NewsfeedSettings, 
    NewsArticle, 
    NewsfeedConfig
)
from app.features.newsfeed.crud.newsfeed_crud import (
    get_news_article_by_id, 
    get_news_articles, 
    get_news_articles_by_retention,
    get_newsfeed_settings,
    get_recent_news_articles,
    get_title_word_frequency,
    news_article_exists,
    create_news_article,
    get_newsfeed_config
)
from app.core.settings.keywords.crud.keywords_settings_crud import get_keywords
from app.features.newsfeed.utils.fetching import parse_feed, fetch_article_full_text, extract_and_categorize_iocs

logger = logging.getLogger(__name__)

SKIP_PROCESSING_DOMAINS = {'bsky.app', 'reddit.com', 'www.reddit.com'}
MAX_CONCURRENT_REQUESTS = 10
CHUNK_SIZE = 20

semaphore = asyncio.Semaphore(MAX_CONCURRENT_REQUESTS)

async def check_article_exists(db: Session, link: str) -> bool:
    """Check if article already exists in database."""
    try:
        return news_article_exists(db=db, link=link)
    except Exception as e:
        logger.error(f"Error checking article existence: {str(e)}")
        return False

async def get_full_text(link: str) -> str:
    """Get full text of article asynchronously."""
    try:
        return await asyncio.to_thread(fetch_article_full_text, link)
    except Exception as e:
        logger.error(f"Error fetching full text for {link}: {str(e)}")
        return ""

async def extract_iocs(content: str, full_text: str) -> Optional[Dict]:
    """Extract IOCs from content asynchronously."""
    try:
        return await asyncio.to_thread(
            extract_and_categorize_iocs,
            content,
            full_text
        )
    except Exception as e:
        logger.error(f"Error extracting IOCs: {str(e)}")
        return None

async def gather_article_data(
    link: str, 
    process_full_text: bool,
    title: str,
    summary: str
) -> Tuple[str, Optional[Dict]]:
    """Gather article data concurrently."""
    try:
        if not process_full_text:
            # Create combined content from title and summary only
            combined_content = f"{title} {summary}"
            iocs_dict = await extract_iocs(combined_content, "")
            return "", iocs_dict

        full_text = await get_full_text(link)
        
        # Create combined content including full text if available
        combined_content = f"{title} {summary} {full_text}" if full_text else f"{title} {summary}"
        iocs_dict = await extract_iocs(combined_content, full_text)

        return full_text, iocs_dict

    except Exception as e:
        logger.error(f"Error gathering article data for {link}: {str(e)}")
        return "", None

def parse_published_date(post: Dict[str, Any]) -> datetime:
    """Parse published date from post."""
    try:
        if hasattr(post, 'published_parsed') and post.published_parsed:
            return datetime.fromtimestamp(time.mktime(post.published_parsed))
    except Exception as e:
        logger.error(f"Error parsing published date: {str(e)}")
    return datetime.utcnow()

async def store_article(
    db: Session,
    entry: Dict[str, Any],
    post: Dict[str, Any],
    full_text: str,
    iocs_dict: Optional[Dict],
    keyword_matching_enabled: bool,
    keywords: List[str]
) -> None:
    """Store processed article in database."""
    try:
        title = post.get('title', '')
        summary = post.get('summary', post.get('description', ''))
        all_content = f"{title} {summary} {full_text}" if full_text else f"{title} {summary}"
        
        matches = None
        if keyword_matching_enabled:
            matches = [k for k in keywords if k.lower() in all_content.lower()]

        news_article = NewsArticleSchema(
            feedname=entry['name'],
            icon=entry['icon'],
            title=title,
            summary=re.compile(r'<[^>]+>').sub('', summary),
            full_text=full_text if full_text else None,
            date=parse_published_date(post),
            link=post.get('link', ''),
            fetched_at=datetime.utcnow(),
            matches=matches if matches else None,
            iocs=iocs_dict,
            relevant_iocs=None,
            analysis_result=None,
            note=None,
            tlp="TLP:CLEAR",
            read=False
        )

        create_news_article(db=db, news_article=news_article)
        logger.info("Stored article: %s", title)

    except Exception as e:
        logger.error(f"Error storing article {post.get('title', 'Unknown')}: {str(e)}")

async def process_feed_entry(
    db: Session,
    entry: Dict[str, Any],
    post: Dict[str, Any],
    keyword_matching_enabled: bool,
    keywords: List[str]
) -> None:
    """Process individual feed entry asynchronously with proper error handling and rate limiting."""
    try:
        async with semaphore:  # Rate limit concurrent operations
            link = post.get('link', '')
            if not link:
                logger.warning("No link found in feed entry, skipping")
                return

            if await check_article_exists(db, link):
                logger.debug("Article already exists: %s", post.get('title', 'No title'))
                return

            domain = urlparse(link).netloc.lower()
            process_full_text = domain not in SKIP_PROCESSING_DOMAINS

            full_text, iocs_dict = await gather_article_data(
                link, 
                process_full_text,
                post.get('title', ''),
                post.get('summary', post.get('description', ''))
            )

            await store_article(
                db, entry, post, full_text, iocs_dict,
                keyword_matching_enabled, keywords
            )

    except Exception as e:
        logger.error(f"Error processing feed entry {post.get('title', 'Unknown')}: {str(e)}")

async def process_feed_chunk(
    db: Session,
    feeds: List[Dict[str, Any]],
    keyword_matching_enabled: bool,
    keywords: List[str]
) -> None:
    """Process a chunk of feeds concurrently."""
    tasks = []
    
    for entry in feeds:
        try:
            feed = parse_feed(entry['url'])
            if not feed or not feed.entries:
                logger.warning(f"No entries found in feed: {entry['name']}")
                continue

            tasks.extend([
                process_feed_entry(db, entry, post, keyword_matching_enabled, keywords)
                for post in feed.entries
            ])
        except Exception as e:
            logger.error(f"Error processing feed {entry['name']}: {str(e)}")

    if tasks:
        await asyncio.gather(*tasks)

async def fetch_and_store_news(db: Session) -> None:
    """Fetch and store news articles from configured feeds asynchronously with improved concurrency."""
    logger.info("Starting fetch_and_store_news")
    try:
        config = get_newsfeed_config(db=db)
        keyword_matching_enabled = config.keyword_matching_enabled
        keywords = [k.keyword for k in get_keywords(db=db)] if keyword_matching_enabled else []

        feeds = [feed.to_dict() for feed in get_newsfeed_settings(db=db) if feed.enabled]
        
        # Process feeds in chunks
        for i in range(0, len(feeds), CHUNK_SIZE):
            chunk = feeds[i:i + CHUNK_SIZE]
            await process_feed_chunk(db, chunk, keyword_matching_enabled, keywords)

        config.last_fetch_timestamp = datetime.utcnow()
        db.commit()
        logger.info("Completed fetch_and_store_news")

    except Exception as e:
        logger.error(f"Error in fetch_and_store_news: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


def fetch_paginated_articles(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    matches_null: Optional[bool] = None,
    iocs_null: Optional[bool] = None,
    relevant_iocs_null: Optional[bool] = None,
    analysis_result_null: Optional[bool] = None,
    note_null: Optional[bool] = None,
    tlp: Optional[str] = None,
    read: Optional[bool] = None,
) -> Dict[str, Any]:
    """
    Fetch all news articles from the database with pagination and enhanced filtering capabilities.
    
    Args:
        db (Session): Database session
        page (int): Current page number
        page_size (int): Number of items per page
        start_date (Optional[str]): Filter articles after this date
        end_date (Optional[str]): Filter articles before this date
        matches_null (Optional[bool]): Filter articles where matches is/isn't null
        iocs_null (Optional[bool]): Filter articles where iocs is/isn't null
        relevant_iocs_null (Optional[bool]): Filter articles where relevant_iocs is/isn't null
        analysis_result_null (Optional[bool]): Filter articles where analysis_result is/isn't null
        note_null (Optional[bool]): Filter articles where note is/isn't null
        tlp (Optional[str]): Filter articles by TLP value
        read (Optional[bool]): Filter articles by read status
    
    Returns:
        Dict containing total_count, page, page_size, and articles
    """
    try:
        # Base query
        articles_query = db.query(NewsArticle)

        if start_date:
            articles_query = articles_query.filter(
                NewsArticle.date >= start_date
            )
        if end_date:
            articles_query = articles_query.filter(
                NewsArticle.date <= end_date
            )

        null_filters = {
            'matches': matches_null,
            'iocs': iocs_null,
            'relevant_iocs': relevant_iocs_null,
            'analysis_result': analysis_result_null,
            'note': note_null
        }

        for field, is_null in null_filters.items():
            if is_null is not None:
                column = getattr(NewsArticle, field)
                articles_query = articles_query.filter(
                    column.is_(None) if is_null else column.is_not(None)
                )

        if tlp:
            articles_query = articles_query.filter(
                NewsArticle.tlp == tlp
            )
        if read is not None:
            articles_query = articles_query.filter(
                NewsArticle.read == read
            )

        total_count = articles_query.count()

        # Apply pagination
        articles = (
            articles_query.order_by(NewsArticle.date.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        return {
            "total_count": total_count,
            "page": page,
            "page_size": page_size,
            "articles": [article.to_dict() for article in articles]
        }

    except Exception as e:
        logger.error(f"Error fetching paginated articles: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching articles: {str(e)}"
        )


async def get_news_from_db(db: Session) -> List[Dict[str, Any]]:
    """
    Retrieve news articles from database based on retention period.
    
    Args:
        db (Session): Database session
    
    Returns:
        List[Dict[str, Any]]: List of news articles as dictionaries
    """
    try:
        config = get_newsfeed_config(db=db)
        retention_days = config.retention_days

        cutoff_date = datetime.utcnow() - timedelta(days=retention_days)

        news_articles = (
            db.query(NewsArticle)
            .filter(NewsArticle.date >= cutoff_date)
            .order_by(NewsArticle.date.desc())
            .all()
        )

        news_list = [article.to_dict() for article in news_articles]
        
        logger.info(f"Retrieved {len(news_list)} news articles from database")
        return news_list
        
    except Exception as e:
        logger.error(f"Error retrieving news from database: {str(e)}")
        return []

async def save_icon(icon_data: bytes, icon_id: str) -> Tuple[bool, Optional[str]]:
    """Save a processed icon file to the filesystem with proper error handling."""
    try:
        file_directory = "app/static/feedicons"
        os.makedirs(file_directory, exist_ok=True)

        icon_id = f"{icon_id}.png" if not icon_id.endswith('.png') else icon_id
        file_path = os.path.join(file_directory, icon_id)
        
        img = await asyncio.to_thread(Image.open, io.BytesIO(icon_data))
        
        # Optimize image if needed
        if img.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', img.size, 'white')
            background.paste(img, mask=img.split()[-1])
            img = background
        
        # Save processed image
        await asyncio.to_thread(img.save, file_path, 'PNG', optimize=True)
        
        logger.info(f"Successfully saved icon: {icon_id}")
        return True, None

    except Exception as e:
        logger.error(f"Error saving icon: {str(e)}")
        return False, f"Error saving icon: {str(e)}"


async def ask_prompt(prompt: str, api_key: str) -> Optional[str]:
    """
    Send a prompt to OpenAI's GPT-4 model and get the response.
    
    Args:
        prompt (str): The prompt to send to the model
        api_key (str): OpenAI API key
    
    Returns:
        Optional[str]: The model's response or None if there's an error
    """
    try:
        client = OpenAI(api_key=api_key)
        
        response = await client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )
        
        assistant_reply = response.choices[0].message.content
        logger.debug("Successfully received response from OpenAI")
        return assistant_reply
        
    except Exception as e:
        logger.error(f"Error in ask_prompt: {str(e)}")
        return None