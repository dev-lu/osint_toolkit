from typing import Optional
import logging
from contextlib import contextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.jobstores.base import JobLookupError
from sqlalchemy.exc import SQLAlchemyError
from database.database import SessionLocal
from database.crud import get_newsfeed_config
from database import crud
from modules.newsfeed import fetch_and_store_news

logger = logging.getLogger(__name__)

JOB_ID = 'news_fetch'
DEFAULT_INTERVAL = 30  # fallback interval in minutes if config fails

scheduler = AsyncIOScheduler()

@contextmanager
def get_db_session():
    """Context manager for database sessions."""
    db = SessionLocal()
    try:
        yield db
    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        raise
    finally:
        db.close()

async def fetch_news_job():
    """Wrapper function for the news fetching job with proper error handling."""
    try:
        with get_db_session() as db:
            await fetch_and_store_news(db)
            logger.debug("News fetch job completed successfully")
    except Exception as e:
        logger.error(f"Error in news fetch job: {str(e)}")
        # Don't raise the exception to prevent the scheduler from removing the job

def get_scheduler_config() -> tuple[bool, int]:
    """Get scheduler configuration from database.
    
    Returns:
        tuple[bool, int]: (background_fetch_enabled, fetch_interval_minutes)
    """
    try:
        with get_db_session() as db:
            config = get_newsfeed_config(db=db)
            return config.background_fetch_enabled, config.fetch_interval_minutes
    except Exception as e:
        logger.error(f"Error fetching scheduler config: {str(e)}")
        return False, DEFAULT_INTERVAL

def configure_scheduler(enabled: bool, interval: int) -> None:
    """Configure the scheduler with the given parameters."""
    try:
        # Remove existing job if present
        try:
            scheduler.remove_job(JOB_ID)
        except JobLookupError:
            pass

        if enabled:
            scheduler.add_job(
                fetch_news_job,
                IntervalTrigger(minutes=interval),
                id=JOB_ID,
                replace_existing=True,
                max_instances=1  # Prevent overlapping executions
            )
            logger.info(f"Scheduler configured with {interval} minute interval")
        else:
            logger.info("Scheduler disabled as per configuration")
    except Exception as e:
        logger.error(f"Error configuring scheduler: {str(e)}")
        raise

def start_scheduler() -> None:
    """Start the scheduler with configuration from database."""
    try:
        enabled, interval = get_scheduler_config()
        configure_scheduler(enabled, interval)
        
        if not scheduler.running:
            scheduler.start()
            logger.info("Scheduler started successfully")
    except Exception as e:
        logger.error(f"Failed to start scheduler: {str(e)}")
        raise

def update_scheduler() -> None:
    """Update the scheduler with new configuration from database."""
    try:
        if not scheduler.running:
            logger.warning("Attempting to update non-running scheduler")
            start_scheduler()
            return

        enabled, interval = get_scheduler_config()
        configure_scheduler(enabled, interval)
        logger.info("Scheduler updated successfully")
    except Exception as e:
        logger.error(f"Failed to update scheduler: {str(e)}")
        raise

def shutdown_scheduler() -> None:
    """Shutdown the scheduler safely."""
    try:
        if scheduler.running:
            scheduler.shutdown(wait=True)  # Wait for running jobs to complete
            logger.info("Scheduler shutdown successfully")
        else:
            logger.debug("Scheduler already stopped")
    except Exception as e:
        logger.error(f"Error during scheduler shutdown: {str(e)}")
        raise