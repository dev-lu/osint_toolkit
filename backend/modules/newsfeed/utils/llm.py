from typing import Optional, Dict, Any
import logging
import json
from functools import wraps
from sqlalchemy.orm import Session
from openai import AsyncOpenAI 
from openai.types.chat import ChatCompletion
from database import crud
from fastapi import HTTPException

logger = logging.getLogger(__name__)

MODEL_NAME = "gpt-4"
MAX_TOKENS = 5000
TEMPERATURE = 0.7

CTI_ANALYSIS_PROMPT = """
You are an AI assistant that analyzes a news article based on a user's Cyber Threat Intelligence (CTI) profile. Below you will find the CTI profile, the news article and instructions for your analysis.

<CTI Profile>
{cti_profile}
</CTI Profile>

<News Article>
{newsfeed_item}
</News Article>

<Instructions>
Check if the news article is relevant based on the CTI profile above.
Repond in the following format:
<Response Format>
**Relevance: [None | Low | Medium | High]**

**Reason:**
[Reason for relevance]

**Summary:**
[Short summary of the article]

**Possible Action Items:**
[Bullet point list of possible action items]

**Affected Systems:**
[Bullet point list of affected systems like Android Devices, MacOS Computers, Routers, Firewalls, Personal Devices, ...]
</Response Format>

</Instructions>
"""

def validate_api_key(func):
    """Decorator to validate OpenAI API key."""
    @wraps(func)
    async def wrapper(*args, **kwargs): 
        db = kwargs.get('db')
        if not db:
            logger.error("Database session not provided")
            raise ValueError("Database session required")
            
        api_key = crud.get_apikey(name="openai", db=db).get('key')
        if not api_key:
            logger.error("OpenAI API key not found")
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key not configured"
            )
        
        kwargs['api_key'] = api_key
        return await func(*args, **kwargs) 
    return wrapper

def format_prompt(cti_settings: Dict[str, Any], news_article: Dict[str, Any]) -> str:
    """Format the prompt with CTI settings and news article data."""
    try:
        return CTI_ANALYSIS_PROMPT.format(
            cti_profile=json.dumps(cti_settings, indent=2),
            newsfeed_item=json.dumps(news_article, indent=2)
        )
    except Exception as e:
        logger.error(f"Error formatting prompt: {str(e)}")
        raise ValueError("Failed to format prompt with provided data")

async def send_chat_request(prompt: str, api_key: str) -> Optional[str]:
    """
    Send a chat request to OpenAI API.
    
    Args:
        prompt (str): The formatted prompt to send
        api_key (str): OpenAI API key
    
    Returns:
        Optional[str]: The model's response or None if there's an error
    """
    try:
        client = AsyncOpenAI(api_key=api_key) 
        
        response: ChatCompletion = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=TEMPERATURE,
            max_tokens=MAX_TOKENS
        )
        
        if not response.choices:
            logger.error("No response choices received from OpenAI")
            return None
            
        return response.choices[0].message.content

    except Exception as e:
        logger.error(f"Error in OpenAI chat request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get response from OpenAI: {str(e)}"
        )

@validate_api_key
async def analyze_article_on_demand(
    article_id: int,
    db: Session,
    api_key: str
) -> Dict[str, Any]: 
    """
    Analyze a news article using the OpenAI model.
    
    Args:
        article_id (int): ID of the article to analyze
        db (Session): Database session
        api_key (str): OpenAI API key (injected by decorator)
    
    Returns:
        Dict[str, Any]: Analysis result wrapped in a dictionary
    """
    try:
        news_article_record = crud.get_news_article_by_id(db=db, article_id=article_id)
        if not news_article_record:
            logger.warning(f"Article with ID {article_id} not found")
            raise HTTPException(
                status_code=404,
                detail=f"Article with ID {article_id} not found"
            )
        
        cti_settings = crud.get_cti_settings(db=db).to_dict().get('settings', {})
        if not cti_settings:
            logger.warning("No CTI settings found")
            raise HTTPException(
                status_code=400,
                detail="CTI settings not configured"
            )
        
        prompt = format_prompt(cti_settings, news_article_record.to_dict())
        analysis_result = await send_chat_request(prompt, api_key)
        
        if analysis_result:
            news_article_record.analysis_result = analysis_result
            db.commit()
            logger.info(f"Analysis completed for article ID {article_id}")
        
        return {"analysis": analysis_result}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing article {article_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing article: {str(e)}"
        )