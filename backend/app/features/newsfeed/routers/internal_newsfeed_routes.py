from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import logging
import json
from typing import List, Optional
import os
import base64

from app.core.dependencies import get_db
from app.core.scheduler import update_scheduler

from app.features.ioc_extractor.service.ioc_extractor_service import extract_iocs
from app.features.newsfeed.utils.validation import validate_feed, validate_and_process_icon
from app.features.newsfeed.service import newsfeed_service
from app.features.newsfeed.schemas.newsfeed_schemas import NewsArticleSchema, UpdateArticleRequest, NewsAnalysisParams
from app.features.newsfeed.crud.newsfeed_crud import get_newsfeed_config as crud_get_config
from app.features.newsfeed.crud.newsfeed_crud import update_newsfeed_config as crud_update_config
from app.features.newsfeed.crud.newsfeed_crud import (
    get_newsfeed_settings, 
    create_newsfeed_settings,
    update_newsfeed_settings, 
    delete_newsfeed_settings, 
    disable_feed,
    get_news_articles,
    get_news_articles_by_retention,
    create_news_article,
    delete_old_news_articles, 
    news_article_exists,
    get_news_article_by_id,
    create_custom_feed, 
    delete_custom_feed, 
    update_news_article,
    get_newsfeed_retention_days,
    set_retention_days,
    get_recent_news_articles,
    get_title_word_frequency,
    get_news_articles_by_ids,
)
from app.features.newsfeed.models.newsfeed_models import (
    NewsfeedSettings, 
    NewsArticle, 
    NewsfeedConfig
)
from app.features.newsfeed.schemas.newsfeed_schemas import (
    NewsfeedSettingsSchema,
    NewsfeedSettingsCreateSchema,
    NewsArticleSchema,
    NewsfeedConfigSchema, 
    NewsArticleSchema, 
    UpdateArticleRequest
)


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
@router.get("/api/settings/modules/newsfeed/", response_model=list[NewsfeedSettingsSchema], tags=["Newsfeed"])
def read_newsfeed_settings(db: Session = Depends(get_db)):
    settings = get_newsfeed_settings(db)
    if not settings:
        logger.warning("No newsfeed settings found.")
        raise HTTPException(status_code=404, detail="No settings found")
    logger.info("Retrieved newsfeed settings.")
    return [setting.to_dict() for setting in settings]

# Create or update newsfeed settings
@router.put("/api/settings/modules/newsfeed/", response_model=NewsfeedSettingsSchema, tags=["Newsfeed"])
def update_newsfeed_settings(settings: NewsfeedSettingsSchema, db: Session = Depends(get_db)):
    updated_settings = update_newsfeed_settings(
        db, settings.name, settings)
    logger.info("Updated newsfeed settings for %s.", settings.name)
    return updated_settings

# Delete Newsfeed
@router.delete("/api/settings/modules/newsfeed/{id}", response_model=NewsfeedSettingsSchema, tags=["Newsfeed"])
def delete_newsfeed_settings(id: int, db: Session = Depends(get_db)):
    deleted_newsfeed = delete_newsfeed_settings(db, id)
    if not deleted_newsfeed:
        logger.error("Attempt to delete non-existent newsfeed with ID %d.", id)
        raise HTTPException(status_code=404, detail="Newsfeed not found")
    logger.info("Deleted newsfeed with ID %d.", id)
    return {'Success': 'Newsfeed deleted'}

# Enable Newsfeed
@router.post("/api/settings/modules/newsfeed/enable", response_model=NewsfeedSettingsSchema, tags=["Newsfeed"])
def enable_newsfeed(feedName: str, db: Session = Depends(get_db)):
    newsfeed_state = disable_feed(db=db, feedName=feedName)
    if not newsfeed_state:
        logger.error("Newsfeed %s not found to enable.", feedName)
        raise HTTPException(status_code=404, detail="Newsfeed not found")
    newsfeed_state.enabled = True
    db.commit()
    db.refresh(newsfeed_state)
    logger.info("Enabled newsfeed %s.", feedName)
    return newsfeed_state.to_dict()

# Disable Newsfeed
@router.post("/api/settings/modules/newsfeed/disable", response_model=NewsfeedSettingsSchema, tags=["Newsfeed"])
def disable_newsfeed(feedName: str, db: Session = Depends(get_db)):
    newsfeed_state = disable_feed(db=db, feedName=feedName)
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
    days = get_newsfeed_retention_days(db)
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

@router.get("/api/settings/newsfeed/config", response_model=NewsfeedConfigSchema, tags=["Newsfeed"])
def get_newsfeed_config_route(db: Session = Depends(get_db)):
    """Get newsfeed configuration settings"""
    try:
        config = crud_get_config(db)
        logger.info("Retrieved newsfeed configuration.")
        return config.to_dict()
    except Exception as e:
        logger.error(f"Error retrieving newsfeed config: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve config: {str(e)}")

@router.put("/api/settings/newsfeed/config", response_model=NewsfeedConfigSchema, tags=["Newsfeed"])
def update_newsfeed_config_route(config_data: NewsfeedConfigSchema, db: Session = Depends(get_db)):
    """Update newsfeed configuration settings"""
    try:
        updated_config = crud_update_config(db, config_data)
        update_scheduler()
        logger.info("Updated newsfeed configuration and triggered scheduler update.")
        return updated_config.to_dict()
    except Exception as e:
        logger.error(f"Error updating newsfeed config: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update config: {str(e)}")

@router.post("/api/newsfeed/analyze/{article_id}", tags=["Newsfeed"])
async def analyze_news_article(
    article_id: int, 
    force: bool = Query(False),
    model_id: str = Query("gpt-4o", description="Model ID to use for analysis"),
    temperature: float = Query(0.3, description="Temperature for generation (0.0-1.0)"),
    max_tokens: int = Query(2000, description="Maximum tokens for response"),
    use_cti_settings: bool = Query(True, description="Use CTI settings for relevance analysis"),
    db: Session = Depends(get_db)
):
    """
    Analyze a cybersecurity news article with optional CTI profile integration.
    
    This endpoint analyzes news articles through a cybersecurity lens:
    - Without CTI settings: General cybersecurity analysis
    - With CTI settings: Targeted analysis based on security priorities and concerns
    """
    logger.info(
        "Received request to analyze article ID: %d with model %s, force=%s, use_cti_settings=%s", 
        article_id, model_id, force, use_cti_settings
    )
    
    # Get the news article
    news_article_record = get_news_article_by_id(db=db, article_id=article_id)
    if not news_article_record:
        logger.error("Article with ID %d not found.", article_id)
        raise HTTPException(status_code=404, detail="Article not found")

    # Check if analysis already exists and force is not set
    if news_article_record.analysis_result and not force:
        logger.info("Analysis already completed for article ID %d", article_id)
        try:
            analysis_result = json.loads(news_article_record.analysis_result)
            return {
                "message": "Analysis already completed", 
                "analysis_result": analysis_result
            }
        except json.JSONDecodeError:
            logger.warning("Could not parse stored analysis result as JSON, forcing reanalysis")
            # Continue with analysis if JSON parsing fails

    # Get CTI settings
    cti_settings = None
    try:
        # Import the CRUD function
        from app.core.settings.cti_profile.crud.cti_profile_settings_crud import get_cti_settings
        cti_settings = get_cti_settings(db=db)
        if not cti_settings or not cti_settings.settings:
            logger.warning("CTI settings not found or empty. Using default analysis.")
    except Exception as e:
        logger.error(f"Error retrieving CTI settings: {str(e)}")
        logger.warning("Continuing with default analysis without CTI settings")

    logger.info("Starting analysis for article ID %d using model %s.", article_id, model_id)
    try:
        # Get article attributes
        title = getattr(news_article_record, "title", "No title available")
        
        # Get content from appropriate field
        content = None
        for content_attr in ["full_text", "content", "body", "text", "article_content"]:
            if hasattr(news_article_record, content_attr) and getattr(news_article_record, content_attr):
                content = getattr(news_article_record, content_attr)
                break
        
        if content is None:
            # Fall back to summary if available
            if hasattr(news_article_record, "summary") and news_article_record.summary:
                content = news_article_record.summary
                logger.warning(f"Using 'summary' as fallback for content in article {article_id}")
            else:
                raise ValueError(f"Article has no content")
        
        source = getattr(news_article_record, "source", getattr(news_article_record, "feedname", "Unknown source"))
        
        # Get date from appropriate field
        published_date = None
        for date_attr in ["date", "published_date", "publication_date", "created_at"]:
            if hasattr(news_article_record, date_attr) and getattr(news_article_record, date_attr):
                published_date = getattr(news_article_record, date_attr)
                break
        
        if published_date is None:
            published_date = "Unknown date"
        
        # Create the news article object for the prompt
        newsfeed_item = {
            "title": title,
            "source": source,
            "date": published_date,
            "content": content
        }
        
        # Format CTI settings for prompt (if available)
        cti_profile_text = "Default CTI Profile: General cybersecurity monitoring with focus on critical vulnerabilities, active threats, and major security incidents."
        if cti_settings and cti_settings.settings:
            # Convert JSON settings to markdown
            try:
                # Parse the JSON settings
                settings_dict = json.loads(cti_settings.settings)
                
                # Convert settings to markdown format
                markdown_sections = []
                
                def dict_to_markdown(data, level=0):
                    """Recursively convert a dictionary to markdown with proper indentation"""
                    markdown_lines = []
                    indent = "  " * level
                    
                    for key, value in data.items():
                        # Skip disabled items (if they have an 'enabled' key set to False)
                        if isinstance(value, dict) and 'enabled' in value and value['enabled'] is False:
                            continue
                            
                        # Format the key as a header or list item
                        if level == 0:  # Top-level keys as headers
                            markdown_lines.append(f"## {key.title()}")
                        else:  # Nested keys as list items with bold
                            markdown_lines.append(f"{indent}- **{key.title()}**:")
                        
                        # Process the value based on its type
                        if isinstance(value, dict):
                            # If it has 'enabled' and 'details', handle specially
                            if 'enabled' in value and 'details' in value and value['enabled']:
                                markdown_lines[-1] += f" {value['details']}"
                            else:
                                # Remove 'enabled' key if it exists to avoid cluttering the markdown
                                value_copy = value.copy()
                                if 'enabled' in value_copy:
                                    del value_copy['enabled']
                                    
                                # Process the remaining dictionary
                                if value_copy:
                                    nested_md = dict_to_markdown(value_copy, level + 1)
                                    markdown_lines.extend(nested_md)
                        elif isinstance(value, list):
                            # Format lists
                            for item in value:
                                if isinstance(item, dict):
                                    nested_md = dict_to_markdown(item, level + 1)
                                    markdown_lines.extend(nested_md)
                                else:
                                    markdown_lines.append(f"{indent}  - {item}")
                        elif isinstance(value, bool):
                            # For boolean values, only include if True and don't show the value
                            if value:
                                # Replace the last line to make it cleaner (without the colon)
                                markdown_lines[-1] = f"{indent}- **{key.title()}**"
                            else:
                                # Remove the line with False value
                                markdown_lines.pop()
                        else:
                            # For simple values, add them inline
                            markdown_lines[-1] += f" {value}"
                    
                    return markdown_lines
                
                # Generate markdown
                markdown_lines = dict_to_markdown(settings_dict)
                
                # Add a header if there's content
                if markdown_lines:
                    markdown_lines.insert(0, "# CTI Profile")
                    markdown_lines.append("")  # Add trailing newline
                    cti_profile_text = "\n".join(markdown_lines)
                    
                    logger.debug("Generated CTI profile markdown:\n%s", cti_profile_text)
                        
            except json.JSONDecodeError:
                logger.warning("Failed to parse CTI settings JSON, using default profile")
            except Exception as e:
                logger.error(f"Error converting CTI settings to markdown: {str(e)}")
                logger.warning("Using default CTI profile")
        
        # System prompt - cybersecurity focus
        system_prompt = """
        You are an expert cybersecurity analyst specializing in threat intelligence, vulnerability analysis, and security operations. 
        Your task is to analyze cybersecurity news articles and determine their relevance and implications.
        Provide clear, concise, and actionable insights that security teams can use to improve their security posture.
        """
        
        # Build the user prompt using the CTI format
        user_prompt = f"""
        You are an AI assistant that analyzes a news article based on a user's Cyber Threat Intelligence (CTI) profile. Below you will find the CTI profile, the news article and instructions for your analysis.
        
        <CTI Profile>
        {cti_profile_text}
        </CTI Profile>
        
        <News Article>
        Title: {newsfeed_item['title']}
        Source: {newsfeed_item['source']}
        Date: {newsfeed_item['date']}
        
        Content:
        {newsfeed_item['content']}
        </News Article>
        
        <Instructions>
        Check if the news article is relevant based on the CTI profile above.
        Analyze and categorize the relevance of this article.
        Provide your response as valid JSON with the following structure:
        </Instructions>
        
        {{"relevance": "None | Low | Medium | High",
        "reason": "Detailed explanation of why this article is relevant or not relevant to the CTI profile",
        "summary": "Concise summary of the article (2-3 sentences)",
        "key_points": ["Key point 1", "Key point 2", "Key point 3"],
        "action_items": ["Possible action 1", "Possible action 2"],
        "affected_systems": ["System type 1", "System type 2"]}}
        
        Provide only the JSON response without any additional text, markdown formatting, or explanations.
        """
        
        # Import here to avoid circular imports
        from app.utils.llm_service import create_llm_service
        
        # Create LLM service - passing db explicitly
        llm_service_instance = create_llm_service(db)
        
        # Execute the prompt
        analysis_text = llm_service_instance.execute_prompt(
            model_id=model_id,
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        # Process the response
        try:
            # Try to parse as JSON directly
            analysis_json = json.loads(analysis_text)
            
            # Convert the JSON to markdown for frontend rendering
            markdown_content = []
            
            # Add relevance with appropriate styling
            relevance = analysis_json.get("relevance", "Unknown")
            relevance_color = {
                "None": "🟢", 
                "Low": "🟡", 
                "Medium": "🟠", 
                "High": "🔴"
            }.get(relevance, "⚪")
            
            markdown_content.append(f"**Relevance:** {relevance_color} {relevance}")
            markdown_content.append("")
            
            # Add reason
            if "reason" in analysis_json:
                markdown_content.append(f"**Reason:**")
                markdown_content.append(f"{analysis_json['reason']}")
                markdown_content.append("")
            
            # Add summary
            if "summary" in analysis_json:
                markdown_content.append(f"**Summary:**")
                markdown_content.append(f"{analysis_json['summary']}")
                markdown_content.append("")
            
            # Add key points as a list
            if "key_points" in analysis_json and analysis_json["key_points"]:
                markdown_content.append(f"**Key Points:**")
                for point in analysis_json["key_points"]:
                    markdown_content.append(f"- {point}")
                markdown_content.append("")
            
            # Add action items as a list
            if "action_items" in analysis_json and analysis_json["action_items"]:
                markdown_content.append(f"**Action Items:**")
                for item in analysis_json["action_items"]:
                    markdown_content.append(f"- {item}")
                markdown_content.append("")
            
            # Add affected systems as a list
            if "affected_systems" in analysis_json and analysis_json["affected_systems"]:
                markdown_content.append(f"**Affected Systems:**")
                for system in analysis_json["affected_systems"]:
                    markdown_content.append(f"- {system}")
            
            # Join all markdown content with line breaks
            markdown_result = "\n".join(markdown_content)
            
            # Create a new JSON structure with the markdown content
            formatted_json = {
                "markdown": markdown_result,
                "raw": analysis_json  # Keep the original JSON for reference
            }
            
            # Save the formatted JSON to the database
            news_article_record.analysis_result = json.dumps(formatted_json)
            db.commit()
            
            # Return the analysis result
            response = {
                "message": "Analysis completed", 
                "analysis_result": formatted_json
            }
            
            # Add information about CTI settings used
            if use_cti_settings and cti_settings:
                response["cti_settings_used"] = True
                
            return response
            
        except json.JSONDecodeError:
            # If direct parsing fails, try to extract JSON from text
            logger.warning("Failed to parse response as JSON directly, attempting to extract JSON")
            import re
            json_match = re.search(r'(\{.*\})', analysis_text, re.DOTALL)
            if json_match:
                try:
                    analysis_json = json.loads(json_match.group(1))
                    
                    # Convert the JSON to markdown format (same as above)
                    markdown_content = []
                    
                    # Add relevance with appropriate styling
                    relevance = analysis_json.get("relevance", "Unknown")
                    relevance_color = {
                        "None": "🟢", 
                        "Low": "🟡", 
                        "Medium": "🟠", 
                        "High": "🔴"
                    }.get(relevance, "⚪")
                    
                    markdown_content.append(f"**Relevance:** {relevance_color} {relevance}")
                    markdown_content.append("")
                    
                    # Add reason
                    if "reason" in analysis_json:
                        markdown_content.append(f"**Reason:**")
                        markdown_content.append(f"{analysis_json['reason']}")
                        markdown_content.append("")
                    
                    # Add summary
                    if "summary" in analysis_json:
                        markdown_content.append(f"**Summary:**")
                        markdown_content.append(f"{analysis_json['summary']}")
                        markdown_content.append("")
                    
                    # Add key points as a list
                    if "key_points" in analysis_json and analysis_json["key_points"]:
                        markdown_content.append(f"**Key Points:**")
                        for point in analysis_json["key_points"]:
                            markdown_content.append(f"- {point}")
                        markdown_content.append("")
                    
                    # Add action items as a list
                    if "action_items" in analysis_json and analysis_json["action_items"]:
                        markdown_content.append(f"**Action Items:**")
                        for item in analysis_json["action_items"]:
                            markdown_content.append(f"- {item}")
                        markdown_content.append("")
                    
                    # Add affected systems as a list
                    if "affected_systems" in analysis_json and analysis_json["affected_systems"]:
                        markdown_content.append(f"**Affected Systems:**")
                        for system in analysis_json["affected_systems"]:
                            markdown_content.append(f"- {system}")
                    
                    # Join all markdown content with line breaks
                    markdown_result = "\n".join(markdown_content)
                    
                    # Create a new JSON structure with the markdown content
                    formatted_json = {
                        "markdown": markdown_result,
                        "raw": analysis_json  # Keep the original JSON for reference
                    }
                    
                    # Save the formatted JSON to the database
                    news_article_record.analysis_result = json.dumps(formatted_json)
                    db.commit()
                    
                    # Return the analysis result
                    response = {
                        "message": "Analysis completed", 
                        "analysis_result": formatted_json
                    }
                    
                    # Add information about CTI settings used
                    if use_cti_settings and cti_settings:
                        response["cti_settings_used"] = True
                        
                    return response
                    
                except json.JSONDecodeError:
                    logger.error("Extracted text is not valid JSON")
                    raise ValueError("Could not extract valid JSON from the model response")
            else:
                raise ValueError("Could not extract valid JSON from the model response")
        
    except ValueError as e:
        logger.error("Validation error during analysis: %s", str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Error during analysis for article ID %d: %s", article_id, str(e))
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")




# Get article by ID
@router.get("/api/newsfeed/article/{article_id}", response_model=NewsArticleSchema, tags=["Newsfeed"])
def get_article(article_id: int, db: Session = Depends(get_db)):
    article = get_news_article_by_id(db=db, article_id=article_id)
    if not article:
        logger.error("Article with ID %d not found.", article_id)
        raise HTTPException(status_code=404, detail="Article not found")
    logger.info("Retrieved article with ID %d.", article_id)
    return article.to_dict()


@router.post("/api/newsfeed/articles/bulk", response_model=List[NewsArticleSchema], tags=["Newsfeed"])
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
        articles = get_news_articles_by_ids(db=db, article_ids=article_ids)
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




@router.post("/api/settings/modules/newsfeed/validate", tags=["Newsfeed"])
async def validate_feed_url(feed_data: NewsfeedSettingsSchema, db: Session = Depends(get_db)):
    """Validate a feed URL before adding it."""
    is_valid, error_msg, feed_info = validate_feed(feed_data.url)

    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    return {
        "valid": True,
        "feed_info": feed_info
    }


@router.post("/api/settings/modules/newsfeed/add", tags=["Newsfeed"])
async def add_custom_feed(feed_data: NewsfeedSettingsSchema, db: Session = Depends(get_db)):
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
        new_feed = create_custom_feed(db, feed_data)
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
    feed = db.query(NewsfeedSettings).filter(
        NewsfeedSettings.name == feedName
    ).first()

    if not feed:
        raise HTTPException(status_code=404, detail="Feed not found")

    try:
        if feed.icon_id and feed.icon != "default.png":
            icon_path = os.path.join("app/static/feedicons", feed.icon_id)
            if os.path.exists(icon_path):
                os.remove(icon_path)

        success = delete_custom_feed(db, feedName)
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
    icon_path = f"app/static/feedicons/{icon_base}.png"
    
    logger.debug(f"Looking for icon at path: {icon_path}")
    
    if os.path.exists(icon_path):
        return FileResponse(icon_path)
    
    logger.debug(f"Icon not found at {icon_path}, returning default icon")
    return FileResponse("app/static/feedicons/default.png")


@router.put("/api/newsfeed/article/{article_id}", response_model=NewsArticleSchema, tags=["Newsfeed"])
def update_article_details(
    article_id: int,
    update_data: UpdateArticleRequest,
    db: Session = Depends(get_db)
):
    article = update_news_article(
        db, article_id, note=update_data.note, tlp=update_data.tlp, read=update_data.read
    )
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article.to_dict()


@router.get("/api/newsfeed/article/{article_id}/iocs", tags=["Newsfeed"])
def get_article_iocs(article_id: int, db: Session = Depends(get_db)):
    article = get_news_article_by_id(db=db, article_id=article_id)
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

@router.get("/api/feedicons/{icon_name}", tags=["Newsfeed"])
async def get_feed_icon(icon_name: str):
    """Get feed icon by icon name."""
    # Strip .png extension if it exists
    icon_base = icon_name.rsplit('.png', 1)[0]
    icon_path = f"app/static/feedicons/{icon_base}.png"
    
    logger.debug(f"Looking for icon at path: {icon_path}")
    
    if os.path.exists(icon_path):
        return FileResponse(icon_path)
    
    logger.debug(f"Icon not found at {icon_path}, returning default icon")
    return FileResponse("app/static/feedicons/default.png")