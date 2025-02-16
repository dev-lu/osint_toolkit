from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from utils.dependencies import get_db
from modules.newsfeed.utils.validation import validate_feed, validate_and_process_icon
from database import crud, models, schemas
import logging
import json
from typing import List
from utils.scheduler import update_scheduler
from modules import newsfeed
from modules.ioc_extractor import extract_iocs
from database.schemas import NewsArticleSchema, UpdateArticleRequest
from typing import Optional
import os
import base64

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

router = APIRouter()


def safe_decode_filename(encoded_name: str) -> str:
    """
    Safely decode a base64 encoded filename.
    """
    try:
        # Decode base64 to bytes
        decoded_bytes = base64.b64decode(encoded_name)
        # Convert bytes to string
        decoded_str = decoded_bytes.decode('utf-8')
        return decoded_str
    except Exception as e:
        logger.error(f"Error decoding filename: {str(e)}")
        raise ValueError(f"Invalid encoding: {str(e)}")

# Get newsfeed settings
@router.get("/api/settings/modules/newsfeed/", response_model=list[schemas.NewsfeedSettingsSchema], tags=["Newsfeed"])
def read_newsfeed_settings(db: Session = Depends(get_db)):
    settings = crud.get_newsfeed_settings(db)
    if not settings:
        logger.warning("No newsfeed settings found.")
        raise HTTPException(status_code=404, detail="No settings found")
    logger.info("Retrieved newsfeed settings.")
    return [setting.to_dict() for setting in settings]

# Create or update newsfeed settings
@router.put("/api/settings/modules/newsfeed/", response_model=schemas.NewsfeedSettingsSchema, tags=["Newsfeed"])
def update_newsfeed_settings(settings: schemas.NewsfeedSettingsSchema, db: Session = Depends(get_db)):
    updated_settings = crud.update_newsfeed_settings(
        db, settings.name, settings)
    logger.info("Updated newsfeed settings for %s.", settings.name)
    return updated_settings

# Delete Newsfeed
@router.delete("/api/settings/modules/newsfeed/{id}", response_model=schemas.NewsfeedSettingsSchema, tags=["Newsfeed"])
def delete_newsfeed_settings(id: int, db: Session = Depends(get_db)):
    deleted_newsfeed = crud.delete_newsfeed_settings(db, id)
    if not deleted_newsfeed:
        logger.error("Attempt to delete non-existent newsfeed with ID %d.", id)
        raise HTTPException(status_code=404, detail="Newsfeed not found")
    logger.info("Deleted newsfeed with ID %d.", id)
    return {'Success': 'Newsfeed deleted'}

# Enable Newsfeed
@router.post("/api/settings/modules/newsfeed/enable", response_model=schemas.NewsfeedSettingsSchema, tags=["Newsfeed"])
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
@router.post("/api/settings/modules/newsfeed/disable", response_model=schemas.NewsfeedSettingsSchema, tags=["Newsfeed"])
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
@router.get("/api/settings/newsfeed/retention", response_model=int, tags=["Newsfeed"])
def get_retention_days(db: Session = Depends(get_db)):
    days = crud.get_newsfeed_retention_days(db)
    logger.info("Retrieved newsfeed retention days: %d", days)
    return days

# Update Retention Days
@router.put("/api/settings/newsfeed/retention", tags=["Newsfeed"])
async def set_retention_days(new_retention_days: int, db: Session = Depends(get_db)):
    try:
        updated_config = set_retention_days(db, new_retention_days)
        return {"message": "Retention days updated successfully", "retention_days": updated_config.retention_days}
    except Exception as e:
        return {"error": str(e)}

# Get Newsfeed Config
@router.get("/api/settings/newsfeed/config", response_model=schemas.NewsfeedConfigSchema, tags=["Newsfeed"])
def get_newsfeed_config(db: Session = Depends(get_db)):
    config = crud.get_newsfeed_config(db)
    logger.info("Retrieved newsfeed configuration.")
    return config.to_dict()

# Update Newsfeed Config
@router.put("/api/settings/newsfeed/config", response_model=schemas.NewsfeedConfigSchema, tags=["Newsfeed"])
def update_newsfeed_config(config_data: schemas.NewsfeedConfigSchema, db: Session = Depends(get_db)):
    updated_config = crud.update_newsfeed_config(db, config_data)
    update_scheduler()
    logger.info("Updated newsfeed configuration and triggered scheduler update.")
    return updated_config.to_dict()

# Analyze News Article
@router.post("/api/newsfeed/analyze/{article_id}", tags=["Newsfeed"])
async def analyze_news_article(
    article_id: int, 
    force: bool = Query(False), 
    db: Session = Depends(get_db)
):
    logger.info(
        "Received request to analyze article ID: %d with force=%s", article_id, force)
    
    news_article_record = crud.get_news_article_by_id(
        db=db, article_id=article_id)
    if not news_article_record:
        logger.error("Article with ID %d not found.", article_id)
        raise HTTPException(status_code=404, detail="Article not found")

    if news_article_record.analysis_result and not force:
        logger.info("Analysis already completed for article ID %d", article_id)
        return {
            "message": "Analysis already completed", 
            "analysis_result": news_article_record.analysis_result
        }

    logger.info("Starting on-demand analysis for article ID %d.", article_id)
    try:
        analysis_result = await newsfeed.analyze_article_on_demand(article_id, db=db)
        if analysis_result and analysis_result.get("analysis"):
            logger.info(
                "Analysis completed successfully for article ID %d.", article_id)
            return {
                "message": "Analysis completed", 
                "analysis_result": analysis_result["analysis"]
            }
        else:
            logger.error("Analysis failed for article ID %d", article_id)
            raise HTTPException(status_code=500, detail="Analysis failed")
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error during analysis for article ID %d: %s", article_id, str(e))
        raise HTTPException(status_code=500, detail="Analysis failed")

# Get Keywords
@router.get("/api/settings/keywords/", response_model=List[schemas.KeywordSchema], tags=["Newsfeed"])
def get_keywords(db: Session = Depends(get_db)):
    keywords = crud.get_keywords(db=db)
    logger.info("Retrieved list of keywords.")
    return [keyword.to_dict() for keyword in keywords]

# Get article by ID
@router.get("/api/newsfeed/article/{article_id}", response_model=schemas.NewsArticleSchema, tags=["Newsfeed"])
def get_article(article_id: int, db: Session = Depends(get_db)):
    article = crud.get_news_article_by_id(db=db, article_id=article_id)
    if not article:
        logger.error("Article with ID %d not found.", article_id)
        raise HTTPException(status_code=404, detail="Article not found")
    logger.info("Retrieved article with ID %d.", article_id)
    return article.to_dict()


@router.post("/api/newsfeed/articles/bulk", response_model=List[schemas.NewsArticleSchema], tags=["Newsfeed"])
def get_articles_bulk(article_ids: List[int], db: Session = Depends(get_db)):
    """
    Retrieve multiple articles by their IDs in a single request.
    
    Args:
        article_ids: List of article IDs to fetch
        db: Database session
        
    Returns:
        List of articles matching the provided IDs
    """
    try:
        articles = crud.get_news_articles_by_ids(db=db, article_ids=article_ids)
        found_ids = {article.id for article in articles}
        missing_ids = set(article_ids) - found_ids
        
        if missing_ids:
            logger.warning("Some articles were not found: %s", missing_ids)
            
        logger.info("Retrieved %d articles in bulk.", len(articles))
        return [article.to_dict() for article in articles]
        
    except Exception as e:
        logger.error("Error fetching articles in bulk: %s", e)
        raise HTTPException(
            status_code=500,
            detail="An error occurred while fetching articles"
        )

# Create Keyword
@router.post("/api/settings/keywords/", response_model=schemas.KeywordSchema, tags=["Newsfeed"])
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
@router.delete("/api/settings/keywords/{keyword_id}", tags=["Newsfeed"])
def delete_keyword(keyword_id: int, db: Session = Depends(get_db)):
    success = crud.delete_keyword(db=db, keyword_id=keyword_id)
    if success:
        logger.info("Deleted keyword with ID %d.", keyword_id)
        return {"detail": "Keyword deleted successfully"}
    else:
        logger.error("Keyword with ID %d not found for deletion.", keyword_id)
        raise HTTPException(status_code=404, detail="Keyword not found")


@router.post("/api/settings/modules/newsfeed/validate", tags=["Newsfeed"])
async def validate_feed_url(feed_data: schemas.NewsfeedSettingsSchema, db: Session = Depends(get_db)):
    """Validate a feed URL before adding it."""
    is_valid, error_msg, feed_info = validate_feed(feed_data.url)

    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    return {
        "valid": True,
        "feed_info": feed_info
    }


@router.post("/api/settings/modules/newsfeed/add", tags=["Newsfeed"])
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


@router.post("/api/settings/modules/newsfeed/upload_icon/{feed_name}", tags=["Newsfeed"])
async def upload_feed_icon(
    feed_name: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload and process an icon for a feed."""
    logger.info(f"Processing icon upload for feed: {feed_name}")
    
    try:
        decoded_feed_name = safe_decode_filename(feed_name)
        logger.debug(f"Decoded feed name: {decoded_feed_name}")
        
        file_content = await file.read()
        logger.debug(f"Read file content, size: {len(file_content)} bytes")
        
        is_valid, error_msg, processed_data = validate_and_process_icon(
            file_content,
            file.filename
        )

        if not is_valid:
            logger.warning(f"Icon validation failed: {error_msg}")
            raise HTTPException(status_code=400, detail=error_msg)
        
        processed_image, icon_id = processed_data
        logger.info(f"Icon processed successfully, generated ID: {icon_id}")

        save_success, save_error = await newsfeed.save_icon(processed_image, icon_id)
        if not save_success:
            logger.error(f"Failed to save icon: {save_error}")
            raise HTTPException(status_code=500, detail=save_error)

        feed = db.query(models.NewsfeedSettings).filter(
            models.NewsfeedSettings.name == decoded_feed_name
        ).first()

        if not feed:
            logger.error(f"Feed not found: {decoded_feed_name}")
            raise HTTPException(status_code=404, detail="Feed not found")

        feed.icon = f"{icon_id}"
        feed.icon_id = icon_id
        db.commit()
        
        logger.info(f"Successfully updated icon for feed: {decoded_feed_name}")
        return {
            "message": "Icon uploaded successfully",
            "icon_id": icon_id
        }
        
    except HTTPException:
        raise
    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Unexpected error during icon upload: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while processing the icon"
        )


@router.delete("/api/settings/modules/newsfeed/", tags=["Newsfeed"])
async def delete_custom_feed(feedName: str = Query(...), db: Session = Depends(get_db)):
    """Delete a custom feed and its icon."""
    feed = db.query(models.NewsfeedSettings).filter(
        models.NewsfeedSettings.name == feedName
    ).first()

    if not feed:
        raise HTTPException(status_code=404, detail="Feed not found")

    try:
        if feed.icon_id and feed.icon != "default.png":
            icon_path = os.path.join("static/feedicons", feed.icon_id)
            if os.path.exists(icon_path):
                os.remove(icon_path)

        success = crud.delete_custom_feed(db, feedName)
        if success:
            return {"message": "Feed deleted successfully"}
        raise HTTPException(status_code=404, detail="Feed not found")
    except Exception as e:
        logger.error(f"Error deleting feed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/feedicons/{icon_name}", tags=["Newsfeed"])
async def get_feed_icon(icon_name: str):
    """Get feed icon by icon name."""
    # Strip .png extension if it exists
    icon_base = icon_name.rsplit('.png', 1)[0]
    icon_path = f"static/feedicons/{icon_base}.png"
    
    logger.debug(f"Looking for icon at path: {icon_path}")
    
    if os.path.exists(icon_path):
        return FileResponse(icon_path)
    
    logger.debug(f"Icon not found at {icon_path}, returning default icon")
    return FileResponse("static/feedicons/default.png")


@router.put("/api/newsfeed/article/{article_id}", response_model=NewsArticleSchema, tags=["Newsfeed"])
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


@router.get("/api/newsfeed/article/{article_id}/iocs", tags=["Newsfeed"])
def get_article_iocs(article_id: int, db: Session = Depends(get_db)):
    article = crud.get_news_article_by_id(db=db, article_id=article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    iocs = {
        'ips': json.loads(article.ips) if article.ips else [],
        'md5_hashes': json.loads(article.md5_hashes) if article.md5_hashes else [],
        'sha1_hashes': json.loads(article.sha1_hashes) if article.sha1_hashes else [],
        'sha256_hashes': json.loads(article.sha256_hashes) if article.sha256_hashes else [],
        'urls': json.loads(article.urls) if article.urls else [],
        'domains': json.loads(article.domains) if article.domains else [],
        'emails': json.loads(article.emails) if article.emails else [],
        'cves': json.loads(article.cves) if article.cves else []
    }
    
    return iocs


@router.get("/api/newsfeed/iocs/search", tags=["Newsfeed"])
def search_articles_by_ioc(
    ioc_type: str = Query(..., description="Type of IOC to search for (e.g., ips, md5_hashes)"),
    ioc_value: str = Query(..., description="Value of the IOC to search for"),
    db: Session = Depends(get_db)
):
    valid_ioc_types = ['ips', 'md5_hashes', 'sha1_hashes', 'sha256_hashes', 'urls', 'domains', 'emails', 'cves']
    if ioc_type not in valid_ioc_types:
        raise HTTPException(status_code=400, detail=f"Invalid IOC type. Valid types are: {', '.join(valid_ioc_types)}")
    
    # Fetch articles where the specified IOC type contains the IOC value
    articles = db.query(models.NewsArticle).filter(
        getattr(models.NewsArticle, ioc_type).like(f'%"{ioc_value}"%')
    ).all()
    
    if not articles:
        raise HTTPException(status_code=404, detail="No articles found containing the specified IOC")
    
    return [article.to_dict() for article in articles]
