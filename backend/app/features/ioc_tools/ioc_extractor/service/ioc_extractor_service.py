import regex as re
from collections import OrderedDict
from typing import Dict, List, Tuple, Any
import logging
from functools import lru_cache


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s'
)
logger = logging.getLogger(__name__)

IOC_PATTERNS = {
    'ips': r'\b(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}\b',
    'md5': r'(?i)(?<![a-z0-9])[a-f0-9]{32}(?![a-z0-9])',
    'sha1': r'(?i)(?<![a-z0-9])[a-f0-9]{40}(?![a-z0-9])',
    'sha256': r'(?i)(?<![a-z0-9])[a-f0-9]{64}(?![a-z0-9])',
    'urls': r'https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)',
    'domains': r'\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2,63})\b',
    'emails': r'(?<![\w\.-])[\w\.-]+@[\w\.-]+\.\w{2,}',
    'cves': r'CVE-\d{4}-\d{4,7}'
}

COMPILED_PATTERNS = {
    name: re.compile(pattern) for name, pattern in IOC_PATTERNS.items()
}

IP_ADDRESS_PATTERN = re.compile(r'^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$')

def extract_pattern_from_line(line: str, pattern: re.Pattern) -> List[str]:
    """Extract matches for a given pattern from a line of text."""
    try:
        return pattern.findall(line)
    except Exception as e:
        logger.error(f"Error extracting pattern {pattern.pattern}: {str(e)}")
        return []

def remove_duplicates(items: List[str]) -> Tuple[List[str], int]:
    """Remove duplicates while preserving order and return unique items and count of removed duplicates."""
    unique_items = list(OrderedDict.fromkeys(items))
    removed_count = len(items) - len(unique_items)
    return unique_items, removed_count

@lru_cache(maxsize=1024)
def is_ip_address(domain: str) -> bool:
    """Check if a domain is actually an IP address."""
    return bool(IP_ADDRESS_PATTERN.match(domain))

def filter_domains(domains: List[str]) -> List[str]:
    """Filter out domains that are actually IP addresses."""
    return [domain for domain in domains if not is_ip_address(domain)]

def extract_iocs_from_line(line: str) -> Dict[str, List[str]]:
    """Extract all types of IOCs from a single line."""
    return {
        ioc_type: extract_pattern_from_line(line, pattern)
        for ioc_type, pattern in COMPILED_PATTERNS.items()
    }

def calculate_statistics(
    extracted_iocs: Dict[str, List[str]],
    unique_iocs: Dict[str, List[str]],
    filtered_domains: List[str]
) -> Dict[str, int]:
    """Calculate statistics about the extracted IOCs."""
    stats = {}
    
    for ioc_type in IOC_PATTERNS.keys():
        original_count = len(extracted_iocs.get(ioc_type, []))
        unique_count = len(unique_iocs.get(ioc_type, []))
        
        if ioc_type == 'domains':
            final_count = len(filtered_domains)
        else:
            final_count = unique_count
            
        stats[ioc_type] = final_count
        stats[f'{ioc_type}_removed_duplicates'] = original_count - unique_count
    
    stats['total_unique_iocs'] = sum(
        len(iocs) for ioc_type, iocs in unique_iocs.items()
        if ioc_type != 'domains'
    ) + len(filtered_domains)
    
    return stats

def extract_iocs(content: str) -> Dict[str, Any]:
    """
    Extract Indicators of Compromise (IOCs) from text content.
    
    Args:
        content: String containing potential IOCs
        
    Returns:
        Dictionary containing extracted IOCs and statistics
    """
    logger.info("Starting IOC extraction")
    
    try:
        extracted_iocs: Dict[str, List[str]] = {
            ioc_type: [] for ioc_type in IOC_PATTERNS.keys()
        }
        
        for line in content.splitlines():
            line_iocs = extract_iocs_from_line(line)
            for ioc_type, iocs in line_iocs.items():
                extracted_iocs[ioc_type].extend(iocs)
        
        unique_iocs = {}
        for ioc_type, iocs in extracted_iocs.items():
            unique_iocs[ioc_type], _ = remove_duplicates(iocs)
        
        filtered_domains = filter_domains(unique_iocs['domains'])
        
        statistics = calculate_statistics(extracted_iocs, unique_iocs, filtered_domains)
        
        result = {
            'ips': unique_iocs['ips'],
            'md5': unique_iocs['md5'],
            'sha1': unique_iocs['sha1'],
            'sha256': unique_iocs['sha256'],
            'urls': unique_iocs['urls'],
            'domains': filtered_domains,
            'emails': unique_iocs['emails'],
            'cves': unique_iocs['cves'],
            'statistics': statistics
        }
        
        logger.info(f"IOC extraction completed. Found {statistics['total_unique_iocs']} unique IOCs")
        return result
        
    except Exception as e:
        logger.error(f"Error during IOC extraction: {str(e)}", exc_info=True)
        raise RuntimeError(f"Failed to extract IOCs: {str(e)}")