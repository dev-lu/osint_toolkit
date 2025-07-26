import asyncio
import logging
import re
from typing import Optional, Tuple, List, Dict, Any
from urllib.parse import urlparse, urljoin
import httpx
from bs4 import BeautifulSoup
import html2text

logger = logging.getLogger(__name__)

class WebContentFetcher:
    """Secure web content fetcher for LLM templates with safety measures."""
    
    MAX_CONTENT_SIZE = 5 * 1024 * 1024  # 5MB
    MAX_REDIRECTS = 5
    TIMEOUT = 30
    
    ALLOWED_SCHEMES = {'http', 'https'}
    
    BLOCKED_DOMAINS = {
        'localhost', '127.0.0.1', '0.0.0.0', '::1',
        '10.', '172.16.', '192.168.',  # Private IP ranges
    }
    
    def __init__(self):
        self.client = httpx.AsyncClient(
            timeout=self.TIMEOUT,
            follow_redirects=True,
            max_redirects=self.MAX_REDIRECTS,
            headers={
                'User-Agent': 'OSINT-Toolkit-WebFetcher/1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            }
        )
        self.html_converter = html2text.HTML2Text()
        self.html_converter.ignore_links = False
        self.html_converter.ignore_images = True
        self.html_converter.ignore_emphasis = False
        self.html_converter.body_width = 0  # Don't wrap lines
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()
    
    def _validate_url(self, url: str) -> Tuple[bool, Optional[str]]:
        """Validate URL for security and format."""
        try:
            parsed = urlparse(url)
            
            # Check scheme
            if parsed.scheme not in self.ALLOWED_SCHEMES:
                return False, f"Unsupported scheme: {parsed.scheme}"
            
            # Check for blocked domains/IPs
            hostname = parsed.hostname
            if not hostname:
                return False, "Invalid hostname"
            
            hostname_lower = hostname.lower()
            for blocked in self.BLOCKED_DOMAINS:
                if hostname_lower == blocked or hostname_lower.startswith(blocked):
                    return False, f"Blocked domain/IP: {hostname}"
            
            # Basic format validation
            if not parsed.netloc:
                return False, "Invalid URL format"
            
            return True, None
            
        except Exception as e:
            return False, f"URL validation error: {str(e)}"
    
    def _extract_text_content(self, html_content: str, url: str) -> str:
        """Extract and clean text content from HTML."""
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer", "header", "aside"]):
                script.decompose()
            
            # Try to find main content areas first
            main_content = None
            for selector in ['main', 'article', '[role="main"]', '.content', '#content', '.post', '.entry']:
                main_content = soup.select_one(selector)
                if main_content:
                    break
            
            # If no main content found, use body
            if not main_content:
                main_content = soup.find('body') or soup
            
            markdown_content = self.html_converter.handle(str(main_content))
            lines = markdown_content.split('\n')
            cleaned_lines = []
            
            for line in lines:
                line = line.strip()
                # Skip empty lines and lines with only special characters
                if line and not re.match(r'^[*\-_=\s]*$', line):
                    cleaned_lines.append(line)
            
            content = '\n'.join(cleaned_lines)
            
            if len(content) > self.MAX_CONTENT_SIZE:
                content = content[:self.MAX_CONTENT_SIZE] + "\n\n[Content truncated due to size limit]"
            
            return content
            
        except Exception as e:
            logger.error(f"Error extracting text from {url}: {str(e)}")
            return f"Error extracting content: {str(e)}"
    
    async def fetch_content(self, url: str) -> Tuple[bool, str, Optional[str]]:
        """
        Fetch and extract content from a URL.
        
        Returns:
            Tuple[bool, str, Optional[str]]: (success, content_or_error, title)
        """
        is_valid, error = self._validate_url(url)
        if not is_valid:
            return False, f"URL validation failed: {error}", None
        
        try:
            logger.info(f"Fetching content from: {url}")
            
            response = await self.client.get(url)
            response.raise_for_status()
            
            content_type = response.headers.get('content-type', '').lower()
            if 'text/html' not in content_type and 'application/xhtml' not in content_type:
                return False, f"Unsupported content type: {content_type}", None
            
            content_length = len(response.content)
            if content_length > self.MAX_CONTENT_SIZE:
                return False, f"Content too large: {content_length} bytes", None
            
            title = None
            try:
                soup = BeautifulSoup(response.text, 'html.parser')
                title_tag = soup.find('title')
                if title_tag:
                    title = title_tag.get_text().strip()
            except Exception:
                pass
            
            content = self._extract_text_content(response.text, url)
            
            logger.info(f"Successfully fetched content from {url} ({len(content)} characters)")
            return True, content, title
            
        except httpx.TimeoutException:
            error_msg = f"Timeout while fetching {url}"
            logger.error(error_msg)
            return False, error_msg, None
            
        except httpx.HTTPStatusError as e:
            error_msg = f"HTTP {e.response.status_code} error for {url}"
            logger.error(error_msg)
            return False, error_msg, None
            
        except Exception as e:
            error_msg = f"Error fetching {url}: {str(e)}"
            logger.error(error_msg)
            return False, error_msg, None
    
    async def fetch_multiple_urls(self, web_contexts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Fetch content from multiple URLs concurrently.
        
        Args:
            web_contexts: List of web context dictionaries with 'url', 'name', 'description'
        
        Returns:
            List of dictionaries with fetched content and metadata
        """
        if not web_contexts:
            return []
        
        logger.info(f"Fetching content from {len(web_contexts)} URLs")
        
        # Create tasks for concurrent fetching
        tasks = []
        for context in web_contexts:
            url = context.get('url', '').strip()
            if url:
                task = self._fetch_single_context(context)
                tasks.append(task)
        
        if not tasks:
            return []
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        successful_results = []
        for result in results:
            if isinstance(result, dict):
                successful_results.append(result)
            elif isinstance(result, Exception):
                logger.error(f"Error in concurrent fetch: {str(result)}")
        
        logger.info(f"Successfully fetched {len(successful_results)} out of {len(web_contexts)} URLs")
        return successful_results
    
    async def _fetch_single_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Fetch content for a single web context."""
        url = context.get('url', '').strip()
        name = context.get('name', 'Web Content')
        description = context.get('description', '')
        
        success, content, title = await self.fetch_content(url)
        
        result = {
            'name': name,
            'url': url,
            'description': description,
            'success': success,
            'content': content,
            'title': title,
            'error': None if success else content
        }
        
        return result


async def fetch_web_contexts(web_contexts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Convenience function to fetch web contexts.
    
    Args:
        web_contexts: List of web context dictionaries
    
    Returns:
        List of fetched content dictionaries
    """
    if not web_contexts:
        return []
    
    async with WebContentFetcher() as fetcher:
        return await fetcher.fetch_multiple_urls(web_contexts)


def format_web_contexts_for_prompt(fetched_contexts: List[Dict[str, Any]]) -> str:
    """
    Format fetched web contexts for inclusion in LLM prompts.
    
    Args:
        fetched_contexts: List of fetched content dictionaries
    
    Returns:
        Formatted string for prompt inclusion
    """
    if not fetched_contexts:
        return ""
    
    formatted_parts = []
    
    for context in fetched_contexts:
        if not context.get('success', False):
            formatted_parts.append(
                f"## {context.get('name', 'Web Content')} (FAILED)\n"
                f"URL: {context.get('url', 'Unknown')}\n"
                f"Error: {context.get('error', 'Unknown error')}\n"
            )
            continue
        
        name = context.get('name', 'Web Content')
        url = context.get('url', '')
        title = context.get('title', '')
        description = context.get('description', '')
        content = context.get('content', '')
        
        header_parts = [f"## {name}"]
        if title and title != name:
            header_parts.append(f"({title})")
        
        formatted_part = "\n".join([
            " ".join(header_parts),
            f"URL: {url}",
            f"Description: {description}" if description else "",
            "",
            content,
            ""
        ])
        
        formatted_parts.append(formatted_part.strip())
    
    return "\n\n---\n\n".join(formatted_parts)
