import feedparser
from newspaper import Article
from app.features.ioc_extractor.service.ioc_extractor_service import extract_iocs
import logging
import re

logger = logging.getLogger(__name__)

def fetch_article_full_text(url: str, timeout: int = 30) -> str:
    """
    Fetches the full text of a news article using newspaper.
    """
    try:
        article = Article(url, language='en')
        article.config.request_timeout = timeout
        article.download()
        article.parse()
        return article.text
    except Exception as e:
        logger.error(f"Error fetching article from {url}: {str(e)}")
        return ""

def parse_feed(feed_url: str):
    """
    Parse a feed URL and return its entries.
    """
    try:
        feed = feedparser.parse(feed_url)
        return feed
    except Exception as e:
        logger.error(f"Error parsing feed {feed_url}: {str(e)}")
        return None

def extract_and_categorize_iocs(summary_content, full_text):
    """
    Extracts and categorizes IOCs from article content.
    """
    summary_iocs = extract_iocs(summary_content)
    logger.info(f"Summary IOCs found: {summary_iocs}")

    full_text_iocs = {'ips': [], 'md5': [], 'sha1': [], 'sha256': [], 'emails': [], 'cves': []}
    if full_text:
        full_text_iocs = extract_iocs(full_text)
        logger.info(f"Full text IOCs found: {full_text_iocs}")

    iocs_dict = {
        'ips': [],
        'md5': [],
        'sha1': [],
        'sha256': [],
        'emails': [],
        'cves': [],
    }

    all_ips = set()
    for ioc_dict in [summary_iocs, full_text_iocs]:
        all_ips.update(ioc_dict.get('ips', []))
        all_ips.update(ioc_dict.get('obfuscated_ips', []))
    iocs_dict['ips'] = list(all_ips)

    for ioc_type in ['md5', 'sha1', 'sha256', 'emails', 'cves']:
        combined = set()
        for ioc_dict in [summary_iocs, full_text_iocs]:
            combined.update(ioc_dict.get(ioc_type, []))
        iocs_dict[ioc_type] = list(combined)

    iocs_dict = {k: v for k, v in iocs_dict.items() if v}
    return iocs_dict
