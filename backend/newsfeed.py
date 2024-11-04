import feedparser
from datetime import datetime, timedelta
import regex as re
from database import crud, models
from database.database import SessionLocal
from database.schemas import NewsArticleSchema
import logging
import time
import json
import uuid
from openai import OpenAI
from typing import Tuple, Optional
import os
from PIL import Image
import io
import mimetypes
from urllib.parse import urlparse
from ioc_extractor import extract_iocs

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

cti_analysis_prompt = """
You are an AI assistant that analyzes a news article based on a user's Cyber Threat Intelligence (CTI) profile.

**CTI Profile:**
{cti_profile}

**Newsfeed Item:**
{newsfeed_item}

**Instructions:**

1. **Determine Relevance:**
   - Analyze the newsfeed item to determine if it is relevant to the user based on the CTI profile provided.
   - Relevance should be based on matching elements such as:
     - **Industry Selection**
     - **Company Size**
     - **Geographical Scope**
     - **Primary Language**
     - **Brand Mentions**
     - **Competitor News Monitoring**
     - **Attack Types of Interest**
     - **Motivation Filters**

2. **If the News is Relevant:**
   - State that the news is **relevant**.
   - Provide a clear explanation of **why** it is relevant by referencing specific elements from the CTI profile that match details in the news item.
   - Suggest possible **action items** that the user might take in response to this news.
   - Extract possible indicators of compromise out of the news article.

3. **If the News is Not Relevant:**
   - State that the news is **not relevant**.
   - Keep this notice short and concise.

**Response Format:**

Please structure your response as follows:


**Relevance:** Relevant / Not Relevant

[If Relevant]

**Reasons:**
- Reason 1
- Reason 2
- ...


**Possible Action Items:**
- Action Item 1
- Action Item 2
- ...

[If IOCs exist]
**Indicators of Compromise:**
- IOC 1
- IOC 2
- ...

Now, please analyze the newsfeed item accordingly.
"""


def fetch_and_store_news():
    db = SessionLocal()
    try:
        logger.info("Starting fetch_and_store_news")
        config = crud.get_newsfeed_config(db=db)
        keyword_matching_enabled = config.keyword_matching_enabled

        if keyword_matching_enabled:
            keywords = [k.keyword for k in crud.get_keywords(db=db)]
            logger.info("Keyword matching is enabled. Keywords: %s", keywords)
        else:
            keywords = []
            logger.info("Keyword matching is disabled.")

        feed_db = crud.get_newsfeed_settings(db=db)
        feeds = [feed.to_dict() for feed in feed_db]

        for entry in feeds:
            if entry['enabled']:
                try:
                    logger.info("Fetching feed: %s", entry['name'])
                    feed = feedparser.parse(entry['url'])
                    logger.info("Number of entries fetched from %s: %d",
                                entry['name'], len(feed.entries))

                    for post in feed.entries:
                        link = post.link

                        if not crud.news_article_exists(db=db, link=link):
                            matches = []
                            content = post.title + " " + post.summary

                            if keyword_matching_enabled:
                                for keyword in keywords:
                                    if keyword.lower() in content.lower():
                                        matches.append(keyword)

                            iocs = extract_iocs(content.encode('utf-8'))

                            news_article = {
                                'feedname': entry['name'],
                                'icon': entry['icon'],
                                'title': post.title,
                                'summary': re.compile(r'<[^>]+>').sub('', post.summary),
                                'date': datetime.fromtimestamp(time.mktime(post.published_parsed)),
                                'link': link,
                                'fetched_at': datetime.utcnow(),
                                'matches': matches if matches else None,
                                'ips': iocs['ips'] if iocs['ips'] else None,
                                'md5_hashes': iocs['md5'] if iocs['md5'] else None,
                                'sha1_hashes': iocs['sha1'] if iocs['sha1'] else None,
                                'sha256_hashes': iocs['sha256'] if iocs['sha256'] else None,
                                'emails': iocs['emails'] if iocs['emails'] else None,
                                'analysis_result': None
                            }

                            news_article_schema = NewsArticleSchema(
                                **news_article)
                            crud.create_news_article(
                                db=db, news_article=news_article_schema)
                            logger.info("Stored article: %s", post.title)
                        else:
                            logger.info(
                                "Article already exists: %s", post.title)
                except Exception as e:
                    logger.error("Error fetching feed %s: %s",
                                 entry['name'], e)
                    raise

        config.last_fetch_timestamp = datetime.utcnow()
        db.commit()

        crud.delete_old_news_articles(
            db=db, retention_days=config.retention_days)
        logger.info("Completed fetch_and_store_news")

    except Exception as e:
        logger.error("Error in fetch_and_store_news: %s", e)
        raise
    finally:
        db.close()


def analyze_article_on_demand(article_id: int):
    logger.info("Starting analysis for article ID: %d", article_id)
    db = SessionLocal()
    try:
        logger.info("Fetching the news article from the database...")
        news_article_record = crud.get_news_article_by_id(
            db=db, article_id=article_id)
        if not news_article_record:
            logger.warning("Article with ID %d not found.", article_id)
            return None
        logger.info("News article fetched successfully.")

        news_article = news_article_record.to_dict()

        logger.info("Fetching CTI settings...")
        cti_settings = crud.get_cti_settings(db=db)
        cti_data = cti_settings.to_dict().get('settings', {})
        if not cti_data:
            logger.warning("No CTI settings found or CTI settings are empty.")
            return None

        logger.info("Retrieving OpenAI API key from the database...")
        api_key_record = crud.get_apikey(name="openai", db=db)
        api_key = api_key_record.get('key', None)
        if not api_key:
            logger.error("OpenAI API key not found.")
            return None
        logger.info("OpenAI API key retrieved successfully.")

        logger.info("Constructing the prompt...")
        prompt = cti_analysis_prompt.format(
            cti_profile=json.dumps(cti_data, indent=2),
            newsfeed_item=json.dumps(news_article, indent=2),
            id=news_article['id'],
            title=news_article['title']
        )

        logger.info("Calling the OpenAI API...")
        analysis_result = ask_prompt(prompt, api_key)
        logger.info("Analysis result received.")

        if analysis_result:
            news_article_record.analysis_result = analysis_result
            db.commit()
            logger.info("Analysis completed for article ID %d", article_id)
            return analysis_result
        else:
            logger.warning("No analysis result for article ID %d", article_id)
            return None
    except Exception as e:
        logger.error("Exception occurred in analyze_article_on_demand: %s", e)
        return None
    finally:
        db.close()
        logger.info("Database session closed.")


def ask_prompt(prompt: str, api_key: str):
    client = OpenAI(api_key=api_key)

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )
        assistant_reply = response.choices[0].message.content
        return assistant_reply
    except Exception as e:
        logger.error("Exception in ask_prompt: %s", e)
        return None


def get_news_from_db():
    db = SessionLocal()
    try:
        config = crud.get_newsfeed_config(db=db)
        retention_days = config.retention_days

        cutoff_date = datetime.utcnow() - timedelta(days=retention_days)

        news_articles = db.query(models.NewsArticle).filter(
            models.NewsArticle.date >= cutoff_date).order_by(models.NewsArticle.date.desc()).all()

        news_list = [article.to_dict() for article in news_articles]

        logger.info("Retrieved %d news articles from database.",
                    len(news_list))
        return news_list
    except Exception as e:
        logger.error("Error in get_news_from_db: %s", e)
        return []
    finally:
        db.close()


def validate_feed(url: str) -> Tuple[bool, Optional[str], Optional[dict]]:
    """
    Validates a feed URL and returns its basic information if valid.
    Returns: (is_valid, error_message, feed_info)
    """
    try:
        parsed_url = urlparse(url)
        if not all([parsed_url.scheme, parsed_url.netloc]):
            return False, "Invalid URL format", None

        feed = feedparser.parse(url)

        if feed.get('bozo', 0) == 1:
            error = feed.get('bozo_exception')
            return False, f"Invalid feed format: {str(error)}", None

        if not feed.entries:
            return False, "Feed contains no entries", None

        required_entry_fields = ['title', 'link']
        if feed.entries:
            entry = feed.entries[0]
            missing_fields = [field for field in required_entry_fields
                              if not hasattr(entry, field)]
            if missing_fields:
                return False, f"Feed entries missing required fields: {', '.join(missing_fields)}", None

        feed_info = {
            'title': feed.feed.get('title', ''),
            'description': feed.feed.get('description', ''),
            'version': feed.get('version', ''),
            'entry_count': len(feed.entries)
        }

        return True, None, feed_info

    except Exception as e:
        logger.error(f"Error validating feed: {str(e)}")
        return False, f"Error validating feed: {str(e)}", None


def validate_and_process_icon(file_content: bytes, original_filename: str) -> Tuple[bool, Optional[str], Optional[bytes]]:
    """
    Validates and processes an icon file.
    Returns: (is_valid, error_message, processed_image_data)
    """
    try:
        MAX_SIZE = 5 * 1024 * 1024
        ALLOWED_TYPES = {'image/png', 'image/jpeg', 'image/gif'}
        TARGET_SIZE = (64, 64)

        if len(file_content) > MAX_SIZE:
            return False, "File size too large (max 5MB)", None

        image_type = mimetypes.guess_type(original_filename)[0]
        if image_type not in ALLOWED_TYPES:
            return False, f"Invalid file type. Allowed types: PNG, JPEG, GIF", None

        try:
            image = Image.open(io.BytesIO(file_content))

            if image.mode != 'RGB':
                image = image.convert('RGB')

            image.thumbnail(TARGET_SIZE, Image.Resampling.LANCZOS)

            output = io.BytesIO()
            image.save(output, format='PNG', optimize=True)
            processed_image = output.getvalue()

            return True, None, processed_image

        except Exception as e:
            return False, f"Invalid image file: {str(e)}", None

    except Exception as e:
        logger.error(f"Error processing icon: {str(e)}")
        return False, f"Error processing icon: {str(e)}", None


def save_icon(icon_data: bytes, feed_name: str) -> Tuple[bool, Optional[str]]:
    """
    Saves a processed icon file to the filesystem.
    Returns: (success, error_message)
    """
    try:
        file_directory = "static/feedicons"
        os.makedirs(file_directory, exist_ok=True)

        file_path = os.path.join(file_directory, f"{feed_name}.png")

        with open(file_path, 'wb') as f:
            f.write(icon_data)

        return True, None
    except Exception as e:
        logger.error(f"Error saving icon: {str(e)}")
        return False, f"Error saving icon: {str(e)}"
