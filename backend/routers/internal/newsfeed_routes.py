from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from dependencies import get_db
from database import crud, models, schemas
import logging
from typing import List
from scheduler import update_scheduler
from newsfeed import analyze_article_on_demand, validate_and_process_icon, validate_feed, save_icon
from ioc_extractor import extract_iocs
from database.schemas import NewsArticleSchema, UpdateArticleRequest
from typing import Optional
import os

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

router = APIRouter()

# Get newsfeed settings
@router.get("/api/settings/modules/newsfeed/", response_model=list[schemas.NewsfeedSettingsSchema], tags=["OSINT Toolkit modules"])
def read_newsfeed_settings(db: Session = Depends(get_db)):
    settings = crud.get_newsfeed_settings(db)
    if not settings:
        logger.warning("No newsfeed settings found.")
        raise HTTPException(status_code=404, detail="No settings found")
    logger.info("Retrieved newsfeed settings.")
    return [setting.to_dict() for setting in settings]

# Create or update newsfeed settings


@router.put("/api/settings/modules/newsfeed/", response_model=schemas.NewsfeedSettingsSchema, tags=["OSINT Toolkit modules"])
def update_newsfeed_settings(settings: schemas.NewsfeedSettingsSchema, db: Session = Depends(get_db)):
    updated_settings = crud.update_newsfeed_settings(
        db, settings.name, settings)
    logger.info("Updated newsfeed settings for %s.", settings.name)
    return updated_settings

# Delete Newsfeed


@router.delete("/api/settings/modules/newsfeed/{id}", response_model=schemas.NewsfeedSettingsSchema, tags=["OSINT Toolkit modules"])
def delete_newsfeed_settings(id: int, db: Session = Depends(get_db)):
    deleted_newsfeed = crud.delete_newsfeed_settings(db, id)
    if not deleted_newsfeed:
        logger.error("Attempt to delete non-existent newsfeed with ID %d.", id)
        raise HTTPException(status_code=404, detail="Newsfeed not found")
    logger.info("Deleted newsfeed with ID %d.", id)
    return {'Success': 'Newsfeed deleted'}

# Enable Newsfeed


@router.post("/api/settings/modules/newsfeed/enable", response_model=schemas.NewsfeedSettingsSchema, tags=["OSINT Toolkit modules"])
def enable_newsfeed(feedName: str, db: Session = Depends(get_db)):
    newsfeed_state = crud.disable_feed(db=db, feedName=feedName)
    if not newsfeed_state:
        logger.error("Newsfeed %s not found to enable.", feedName)
        raise HTTPException(status_code=404, detail="Newsfeed not found")
    newsfeed_state.enabled = True
    db.commit()
    db.refresh(newsfeed_state)
    logger.info("Enabled newsfeed %s.", feedName)
    return newsfeed_state.to_dict()

# Disable Newsfeed


@router.post("/api/settings/modules/newsfeed/disable", response_model=schemas.NewsfeedSettingsSchema, tags=["OSINT Toolkit modules"])
def disable_newsfeed(feedName: str, db: Session = Depends(get_db)):
    newsfeed_state = crud.disable_feed(db=db, feedName=feedName)
    if not newsfeed_state:
        logger.error("Newsfeed %s not found to disable.", feedName)
        raise HTTPException(status_code=404, detail="Newsfeed not found")
    newsfeed_state.enabled = False
    db.commit()
    db.refresh(newsfeed_state)
    logger.info("Disabled newsfeed %s.", feedName)
    return newsfeed_state.to_dict()

# Get Retention Days


@router.get("/api/settings/newsfeed/retention", response_model=int)
def get_retention_days(db: Session = Depends(get_db)):
    days = crud.get_newsfeed_retention_days(db)
    logger.info("Retrieved newsfeed retention days: %d", days)
    return days

# Update Retention Days


@router.put("/api/settings/newsfeed/retention")
def update_retention_days(days: int, db: Session = Depends(get_db)):
    updated_days = crud.update_newsfeed_retention_days(db, days)
    logger.info("Updated newsfeed retention days to %d.", days)
    return updated_days

# Get Newsfeed Config


@router.get("/api/settings/newsfeed/config", response_model=schemas.NewsfeedConfigSchema, tags=["OSINT Toolkit modules"])
def get_newsfeed_config(db: Session = Depends(get_db)):
    config = crud.get_newsfeed_config(db)
    logger.info("Retrieved newsfeed configuration.")
    return config.to_dict()

# Update Newsfeed Config


@router.put("/api/settings/newsfeed/config", response_model=schemas.NewsfeedConfigSchema, tags=["OSINT Toolkit modules"])
def update_newsfeed_config(config_data: schemas.NewsfeedConfigSchema, db: Session = Depends(get_db)):
    updated_config = crud.update_newsfeed_config(db, config_data)
    update_scheduler()
    logger.info("Updated newsfeed configuration and triggered scheduler update.")
    return updated_config.to_dict()

# Analyze News Article


@router.post("/api/newsfeed/analyze/{article_id}", tags=["OSINT Toolkit modules"])
def analyze_news_article(article_id: int, force: bool = Query(False), db: Session = Depends(get_db)):
    logger.info(
        "Received request to analyze article ID: %d with force=%s", article_id, force)
    news_article_record = crud.get_news_article_by_id(
        db=db, article_id=article_id)
    if not news_article_record:
        logger.error("Article with ID %d not found.", article_id)
        raise HTTPException(status_code=404, detail="Article not found")

    if news_article_record.analysis_result and not force:
        logger.info("Analysis already completed for article ID %d", article_id)
        return {"message": "Analysis already completed", "analysis_result": news_article_record.analysis_result}

    logger.info("Starting on-demand analysis for article ID %d.", article_id)
    analysis_result = analyze_article_on_demand(article_id)
    if analysis_result:
        logger.info(
            "Analysis completed successfully for article ID %d.", article_id)
        return {"message": "Analysis completed", "analysis_result": analysis_result}
    else:
        logger.error("Analysis failed for article ID %d", article_id)
        raise HTTPException(status_code=500, detail="Analysis failed")

# Get Keywords


@router.get("/api/settings/keywords/", response_model=List[schemas.KeywordSchema], tags=["Keyword Management"])
def get_keywords(db: Session = Depends(get_db)):
    keywords = crud.get_keywords(db=db)
    logger.info("Retrieved list of keywords.")
    return [keyword.to_dict() for keyword in keywords]

# Create Keyword


@router.post("/api/settings/keywords/", response_model=schemas.KeywordSchema, tags=["Keyword Management"])
def create_keyword(keyword_data: schemas.KeywordSchema, db: Session = Depends(get_db)):
    existing_keyword = db.query(models.Keyword).filter(
        models.Keyword.keyword == keyword_data.keyword).first()
    if existing_keyword:
        logger.warning(
            "Attempt to create an already existing keyword: %s.", keyword_data.keyword)
        raise HTTPException(status_code=400, detail="Keyword already exists")
    keyword = crud.create_keyword(db=db, keyword=keyword_data.keyword)
    logger.info("Created new keyword: %s.", keyword_data.keyword)
    return keyword.to_dict()

# Delete Keyword


@router.delete("/api/settings/keywords/{keyword_id}", tags=["Keyword Management"])
def delete_keyword(keyword_id: int, db: Session = Depends(get_db)):
    success = crud.delete_keyword(db=db, keyword_id=keyword_id)
    if success:
        logger.info("Deleted keyword with ID %d.", keyword_id)
        return {"detail": "Keyword deleted successfully"}
    else:
        logger.error("Keyword with ID %d not found for deletion.", keyword_id)
        raise HTTPException(status_code=404, detail="Keyword not found")


@router.post("/api/settings/modules/newsfeed/validate")
async def validate_feed_url(feed_data: schemas.NewsfeedSettingsSchema, db: Session = Depends(get_db)):
    """Validate a feed URL before adding it."""
    is_valid, error_msg, feed_info = validate_feed(feed_data.url)

    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    return {
        "valid": True,
        "feed_info": feed_info
    }


@router.post("/api/settings/modules/newsfeed/add")
async def add_custom_feed(feed_data: schemas.NewsfeedSettingsSchema, db: Session = Depends(get_db)):
    """Add a new custom feed after validation."""
    is_valid, error_msg, feed_info = validate_feed(feed_data.url)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    existing_feed = db.query(models.NewsfeedSettings).filter(
        models.NewsfeedSettings.name == feed_data.name
    ).first()

    if existing_feed:
        raise HTTPException(status_code=400, detail="Feed name already exists")

    try:
        new_feed = crud.create_custom_feed(db, feed_data)
        return new_feed.to_dict()
    except Exception as e:
        logger.error(f"Error creating feed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/settings/modules/newsfeed/upload_icon/{feed_name}")
async def upload_feed_icon(
    feed_name: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload and process an icon for a feed."""
    file_content = await file.read()

    is_valid, error_msg, processed_image = validate_and_process_icon(
        file_content,
        file.filename
    )

    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    save_success, save_error = save_icon(processed_image, feed_name)
    if not save_success:
        raise HTTPException(status_code=500, detail=save_error)

    feed = db.query(models.NewsfeedSettings).filter(
        models.NewsfeedSettings.name == feed_name
    ).first()

    if not feed:
        raise HTTPException(status_code=404, detail="Feed not found")

    try:
        feed.icon = f"{feed_name}.png"
        db.commit()
        return {"message": "Icon uploaded successfully"}
    except Exception as e:
        logger.error(f"Error updating feed icon in database: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Error updating feed icon in database")


@router.delete("/api/settings/modules/newsfeed/")
async def delete_custom_feed(feedName: str = Query(...), db: Session = Depends(get_db)):
    """Delete a custom feed and its icon."""
    feed = db.query(models.NewsfeedSettings).filter(
        models.NewsfeedSettings.name == feedName
    ).first()

    if not feed:
        raise HTTPException(status_code=404, detail="Feed not found")

    try:
        if feed.icon and feed.icon != "default.png":
            icon_path = os.path.join("static/feedicons", feed.icon)
            if os.path.exists(icon_path):
                os.remove(icon_path)

        success = crud.delete_custom_feed(db, feedName)
        if success:
            return {"message": "Feed deleted successfully"}
        raise HTTPException(status_code=404, detail="Feed not found")
    except Exception as e:
        logger.error(f"Error deleting feed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/feedicons/{icon_name}")
async def get_feed_icon(icon_name: str):
    icon_path = f"static/feedicons/{icon_name}.png"
    if os.path.exists(icon_path):
        return FileResponse(icon_path)
    return FileResponse("static/feedicons/default.png")


@router.put("/api/newsfeed/article/{article_id}", response_model=NewsArticleSchema)
def update_article_details(
    article_id: int,
    update_data: UpdateArticleRequest,
    db: Session = Depends(get_db)
):
    article = crud.update_news_article(
        db, article_id, note=update_data.note, tlp=update_data.tlp, read=update_data.read
    )
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article.to_dict()