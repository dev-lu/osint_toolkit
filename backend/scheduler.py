from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from database.database import SessionLocal
from database.crud import get_newsfeed_config
from database import crud
import newsfeed
import logging

scheduler = BackgroundScheduler()


def start_scheduler():
    db = SessionLocal()
    config = get_newsfeed_config(db=db)
    db.close()
    if config.background_fetch_enabled:
        interval_minutes = config.fetch_interval_minutes
        scheduler.add_job(newsfeed.fetch_and_store_news, IntervalTrigger(
            minutes=interval_minutes), id='news_fetch')
        scheduler.start()
        logging.info(
            f'Scheduler started with interval {interval_minutes} minutes')
    else:
        logging.info('Background fetch is disabled')


def update_scheduler():
    db = SessionLocal()
    config = crud.get_newsfeed_config(db=db)
    db.close()
    scheduler.remove_all_jobs()
    if config.background_fetch_enabled:
        interval_minutes = config.fetch_interval_minutes
        scheduler.add_job(newsfeed.fetch_and_store_news, IntervalTrigger(
            minutes=interval_minutes), id='news_fetch')
        logging.info(
            f'Scheduler updated with interval {interval_minutes} minutes')
    else:
        logging.info('Background fetch is disabled')


def shutdown_scheduler():
    scheduler.shutdown()
    logging.info('Scheduler shutdown')
