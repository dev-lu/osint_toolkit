import mimetypes
import xml.sax
import io
from PIL import Image
import logging
from urllib.parse import urlparse
import feedparser
import uuid
from typing import Tuple, Optional, Dict, Any, TypedDict
from functools import wraps
import time


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s'
)
logger = logging.getLogger(__name__)

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_IMAGE_TYPES = {'image/png', 'image/jpeg', 'image/gif'}
TARGET_IMAGE_SIZE = (64, 64)

class FeedInfo(TypedDict):
    """Type definition for feed information"""
    title: str
    description: str
    version: str
    entry_count: int

def log_execution_time(func):
    """Decorator to log function execution time"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            execution_time = time.time() - start_time
            logger.info(f"{func.__name__} completed in {execution_time:.2f} seconds")
            return result
        except Exception as e:
            execution_time = time.time() - start_time
            logger.error(f"{func.__name__} failed after {execution_time:.2f} seconds: {str(e)}")
            raise
    return wrapper

def generate_icon_filename() -> str:
    """Generate a random filename for the icon.
    
    Returns:
        str: A UUID-based filename with .png extension
    """
    return f"{uuid.uuid4()}.png"

def validate_url_format(url: str) -> Tuple[bool, Optional[str]]:
    """Validate URL format
    
    Args:
        url: The URL to validate
        
    Returns:
        Tuple[bool, Optional[str]]: (is_valid, error_message)
    """
    parsed_url = urlparse(url)
    if not all([parsed_url.scheme, parsed_url.netloc]):
        logger.error(f"Invalid URL format: {url}")
        return False, "Invalid URL format"
    return True, None

def parse_feed_info(feed: feedparser.FeedParserDict) -> Optional[FeedInfo]:
    """Extract feed information from parsed feed
    
    Args:
        feed: Parsed feed dictionary
        
    Returns:
        Optional[FeedInfo]: Feed information if valid, None otherwise
    """
    if not feed.feed:
        return None
        
    return {
        'title': feed.feed.get('title', ''),
        'description': feed.feed.get('description', ''),
        'version': feed.get('version', ''),
        'entry_count': len(feed.entries)
    }

@log_execution_time
def validate_feed(url: str) -> Tuple[bool, Optional[str], Optional[FeedInfo]]:
    """Validate and parse RSS/Atom feed
    
    Args:
        url: The feed URL to validate
        
    Returns:
        Tuple containing:
        - Success status (bool)
        - Error message if any (Optional[str])
        - Feed information if successful (Optional[FeedInfo])
    """
    is_valid_url, url_error = validate_url_format(url)
    if not is_valid_url:
        return False, url_error, None
    
    try:
        logger.info(f"Attempting to parse feed: {url}")
        feed = feedparser.parse(url, sanitize_html=True)
        
        # Check for parsing errors
        if feed.get('bozo', 0) == 1:
            exception = feed.get('bozo_exception')
            error_msg = str(exception) if exception else "Unknown feed parsing error"
            if isinstance(exception, xml.sax._exceptions.SAXParseException):
                error_msg = f"XML parsing error: {error_msg}"
            logger.error(f"Feed parsing failed: {error_msg}")
            return False, error_msg, None
        
        # Validate feed content
        if not feed.entries:
            logger.warning(f"Feed contains no entries: {url}")
            return False, "Feed contains no entries", None
        
        feed_info = parse_feed_info(feed)
        if not feed_info:
            logger.error(f"Invalid feed structure: {url}")
            return False, "Invalid feed structure: missing feed information", None
        
        logger.info(f"Successfully validated feed: {url}")
        return True, None, feed_info
        
    except Exception as e:
        logger.error(f"Unexpected error validating feed: {str(e)}")
        return False, f"Feed validation error: {str(e)}", None

def validate_image_metadata(
    file_content: bytes,
    original_filename: str
) -> Tuple[bool, Optional[str]]:
    """Validate image file metadata
    
    Args:
        file_content: Raw image file content
        original_filename: Original filename of the image
        
    Returns:
        Tuple[bool, Optional[str]]: (is_valid, error_message)
    """
    if len(file_content) > MAX_FILE_SIZE:
        return False, f"File size too large (max {MAX_FILE_SIZE // 1024 // 1024}MB)"

    image_type = mimetypes.guess_type(original_filename)[0]
    if image_type not in ALLOWED_IMAGE_TYPES:
        return False, f"Invalid file type. Allowed: {', '.join(t.split('/')[-1].upper() for t in ALLOWED_IMAGE_TYPES)}"
        
    return True, None

def process_image(image: Image.Image) -> Image.Image:
    """Process image according to requirements
    
    Args:
        image: PIL Image object
        
    Returns:
        Image.Image: Processed image
    """
    # Convert image mode if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')
        logger.info("Converted image mode to RGB")

    # Resize image
    image.thumbnail(TARGET_IMAGE_SIZE, Image.Resampling.LANCZOS)
    return image

@log_execution_time
def validate_and_process_icon(
    file_content: bytes,
    original_filename: str
) -> Tuple[bool, Optional[str], Optional[Tuple[bytes, str]]]:
    """Validate and process an icon image
    
    Args:
        file_content: Raw image file content
        original_filename: Original filename of the image
        
    Returns:
        Tuple containing:
        - Success status (bool)
        - Error message if any (Optional[str])
        - Processed image data and filename if successful (Optional[Tuple[bytes, str]])
    """
    try:
        # Validate metadata
        is_valid, error_msg = validate_image_metadata(file_content, original_filename)
        if not is_valid:
            logger.warning(f"Validation error for {original_filename}: {error_msg}")
            return False, error_msg, None

        # Process image
        with io.BytesIO(file_content) as input_buffer:
            image = Image.open(input_buffer)
            processed_image = process_image(image)
            
            # Save processed image
            output_buffer = io.BytesIO()
            processed_image.save(output_buffer, format='PNG', optimize=True)
            icon_id = generate_icon_filename()
            
            logger.info(
                f"Successfully processed icon: {original_filename} -> {icon_id} "
                f"(size: {len(output_buffer.getvalue()) // 1024}KB)"
            )
            
            return True, None, (output_buffer.getvalue(), icon_id)

    except Exception as e:
        logger.error(f"Error processing icon {original_filename}: {str(e)}")
        return False, f"Invalid image file: {str(e)}", None