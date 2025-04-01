from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from datetime import datetime
import logging
import asyncio
from functools import wraps
from contextlib import contextmanager
import time

from app.core.dependencies import get_db
from app.features.newsfeed.crud.newsfeed_crud import (get_title_word_frequency, get_recent_news_articles)
from app.features.newsfeed.service.report_generator_service import analyze_and_rank_top_articles, analyze_top_articles_stream
from app.features.newsfeed.service import newsfeed_service



logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s'
)
logger = logging.getLogger(__name__)

router = APIRouter()

@contextmanager
def log_execution_time():
    """Context manager to log execution time of operations"""
    start_time = time.time()
    try:
        yield
    finally:
        execution_time = time.time() - start_time
        logger.info(f"Operation completed in {execution_time:.2f} seconds")

def handle_exceptions(func):
    """Decorator for consistent error handling across routes"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            with log_execution_time():
                if asyncio.iscoroutinefunction(func):
                    return await func(*args, **kwargs)
                return func(*args, **kwargs)
        except HTTPException as he:
            logger.warning(f"HTTP Exception in {func.__name__}: {str(he)}")
            raise
        except ValueError as ve:
            logger.error(f"Validation error in {func.__name__}: {str(ve)}")
            raise HTTPException(status_code=400, detail=str(ve))
        except Exception as e:
            logger.error(f"Unexpected error in {func.__name__}: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail="An unexpected error occurred. Please try again later."
            )
    return wrapper

@router.get("/api/newsfeed", tags=["Newsfeed"])
@handle_exceptions
async def get_news():
    """Get news articles from the database"""
    logger.info("Fetching news articles from database")
    return newsfeed_service.get_news_from_db()

@router.get("/api/newsfeed/articles", tags=["Newsfeed"])
@handle_exceptions
async def get_paginated_articles_route(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number for pagination"),
    page_size: int = Query(10, ge=1, le=100, description="Number of articles per page"),
    start_date: Optional[str] = Query(None, description="Start date in YYYY-MM-DD format"),
    end_date: Optional[str] = Query(None, description="End date in YYYY-MM-DD format"),
    has_matches: Optional[bool] = Query(None, description="Filter for articles with matches"),
    has_iocs: Optional[bool] = Query(None, description="Filter for articles with IOCs"),
    has_relevant_iocs: Optional[bool] = Query(None, description="Filter for articles with relevant IOCs"),
    has_analysis: Optional[bool] = Query(None, description="Filter for articles with analysis results"),
    has_note: Optional[bool] = Query(None, description="Filter for articles with notes"),
    tlp: Optional[str] = Query(None, description="Filter by TLP value"),
    read: Optional[bool] = Query(None, description="Filter by read status")
):
    """Route to fetch paginated articles with enhanced filtering"""
    logger.info(f"Fetching paginated articles - Page: {page}, Size: {page_size}")
    
    filters = {
        "matches_null": None if has_matches is None else not has_matches,
        "iocs_null": None if has_iocs is None else not has_iocs,
        "relevant_iocs_null": None if has_relevant_iocs is None else not has_relevant_iocs,
        "analysis_result_null": None if has_analysis is None else not has_analysis,
        "note_null": None if has_note is None else not has_note
    }

    articles_data = await asyncio.to_thread(
        newsfeed_service.fetch_paginated_articles,
        db, page, page_size, start_date, end_date,
        **filters, tlp=tlp, read=read
    )

    if not articles_data["articles"]:
        logger.info("No articles found for the given filters")
        return {
            "total_count": 0,
            "page": page,
            "page_size": page_size,
            "articles": []
        }

    return articles_data

@router.get("/api/recent_articles", tags=["Newsfeed"])
@handle_exceptions
async def get_recent_articles(
    db: Session = Depends(get_db),
    time_filter: str = Query("7d", regex="^(8h|24h|2d|7d|30d|alltime)$")
):
    """Get recent articles based on time filter"""
    logger.info(f"Fetching recent articles with time filter: {time_filter}")
    recent_articles = await asyncio.to_thread(get_recent_news_articles, db, time_filter)
    
    if not recent_articles:
        raise HTTPException(status_code=404, detail="No articles found")
    return recent_articles

@router.post("/api/newsfeed/fetch", tags=["Newsfeed"])
@handle_exceptions
async def fetch_news(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Fetch new news and store them in the database"""
    logger.info("Initiating background news fetch")
    background_tasks.add_task(newsfeed_service.fetch_and_store_news, db)
    return {"message": "News fetch initiated"}

@router.post("/api/newsfeed/fetch_and_get", tags=["Newsfeed"])
@handle_exceptions
async def fetch_and_get_news(db: Session = Depends(get_db)):
    """Fetch new news, store them, and return latest news"""
    logger.info("Fetching and storing news")
    await newsfeed_service.fetch_and_store_news(db)
    return newsfeed_service.get_news_from_db(db)

@router.get("/api/title_word_frequency", tags=["Newsfeed"], response_model=List[Dict[str, object]])
@handle_exceptions
async def get_title_word_frequency_route(
    db: Session = Depends(get_db),
    limit: int = Query(default=20, ge=1, le=100, description="Number of top words to return"),
    time_range: Optional[str] = Query(
        default=None, 
        regex="^(\d+[hd])$",
        description="Relative time range (e.g., '24h', '7d', '30d')"
    ),
    start_date: Optional[datetime] = Query(
        default=None,
        description="Start date for filtering (ISO format)"
    ),
    end_date: Optional[datetime] = Query(
        default=None,
        description="End date for filtering (ISO format)"
    )
):
    """Get word frequency analysis for article titles"""
    logger.info(f"Analyzing title word frequency - Limit: {limit}, Time range: {time_range}")
    
    frequent_words = await asyncio.to_thread(
        get_title_word_frequency,
        db,
        limit=limit,
        time_range=time_range,
        start_date=start_date,
        end_date=end_date
    )

    if not frequent_words:
        raise HTTPException(status_code=404, detail="No words found in article titles")
    
    return frequent_words

@router.post("/api/analyze_top_articles", tags=["Newsfeed"])
@handle_exceptions
async def post_analyze_top_articles(db: Session = Depends(get_db)):
    """Analyze and rank top 10 recent cybersecurity articles"""
    logger.info("Starting analysis of top articles")
    results = await asyncio.to_thread(analyze_and_rank_top_articles, db)
    return {"articles_analysis": results}

@router.get("/api/analyze_top_articles_stream", tags=["Newsfeed"])
@handle_exceptions
async def get_analyze_top_articles_stream(db: Session = Depends(get_db)):
    """Stream analysis of top 10 articles via SSE"""
    logger.info("Starting streaming analysis of top articles")
    
    def event_stream():
        for message in analyze_top_articles_stream(db):
            yield f"data: {message}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream"
    )