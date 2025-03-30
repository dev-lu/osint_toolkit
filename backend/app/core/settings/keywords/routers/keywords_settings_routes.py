from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging

from app.core.dependencies import get_db
from app.core.settings.keywords.models.keywords_settings_models import Keyword
from app.core.settings.keywords.schemas.keywords_settings_schemas import KeywordSchema
from app.core.settings.keywords.crud.keywords_settings_crud import (
    get_keywords as crud_get_keywords,
    create_keyword as crud_create_keyword,
    delete_keyword as crud_delete_keyword
)

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/api/settings/keywords/", response_model=List[KeywordSchema], tags=["Settings"])
def get_keywords_route(db: Session = Depends(get_db)):
    """Retrieve all keywords"""
    try:
        keywords = crud_get_keywords(db=db)
        logger.info("Retrieved list of keywords.")
        return [keyword.to_dict() for keyword in keywords]
    except Exception as e:
        logger.error(f"Error retrieving keywords: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving keywords: {str(e)}")

@router.post("/api/settings/keywords/", response_model=KeywordSchema, tags=["Settings"])
def create_keyword_route(keyword_data: KeywordSchema, db: Session = Depends(get_db)):
    """Create a new keyword"""
    try:
        existing_keyword = db.query(Keyword).filter(
            Keyword.keyword == keyword_data.keyword).first()
        if existing_keyword:
            logger.warning(
                "Attempt to create an already existing keyword: %s.", keyword_data.keyword)
            raise HTTPException(status_code=400, detail="Keyword already exists")
        
        keyword = crud_create_keyword(db=db, keyword=keyword_data.keyword)
        logger.info("Created new keyword: %s.", keyword_data.keyword)
        return keyword.to_dict()
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating keyword: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating keyword: {str(e)}")

@router.delete("/api/settings/keywords/{keyword_id}", tags=["Settings"])
def delete_keyword_route(keyword_id: int, db: Session = Depends(get_db)):
    """Delete a keyword by ID"""
    try:
        success = crud_delete_keyword(db=db, keyword_id=keyword_id)
        if success:
            logger.info("Deleted keyword with ID %d.", keyword_id)
            return {"detail": "Keyword deleted successfully"}
        else:
            logger.error("Keyword with ID %d not found for deletion.", keyword_id)
            raise HTTPException(status_code=404, detail="Keyword not found")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting keyword: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting keyword: {str(e)}")