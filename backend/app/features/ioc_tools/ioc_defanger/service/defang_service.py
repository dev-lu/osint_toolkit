import re
from typing import List, Dict, Any
from app.features.ioc_tools.ioc_extractor.service.ioc_extractor_service import extract_iocs


DEFANG_PATTERNS = [
    # Protocol defanging
    {'defanged': re.compile(r'hxxp', re.IGNORECASE), 'fanged': 'http'},
    {'defanged': re.compile(r'hxxps', re.IGNORECASE), 'fanged': 'https'},
    {'defanged': re.compile(r'fxp', re.IGNORECASE), 'fanged': 'ftp'},
    
    # Dot defanging
    {'defanged': re.compile(r'\[\.\]'), 'fanged': '.'},
    {'defanged': re.compile(r'\(\.\)'), 'fanged': '.'},
    {'defanged': re.compile(r'\{\.\}'), 'fanged': '.'},
    {'defanged': re.compile(r'\[dot\]', re.IGNORECASE), 'fanged': '.'},
    {'defanged': re.compile(r'\(dot\)', re.IGNORECASE), 'fanged': '.'},
    {'defanged': re.compile(r'\{dot\}', re.IGNORECASE), 'fanged': '.'},
    {'defanged': re.compile(r'\\\\.'), 'fanged': '.'},
    {'defanged': re.compile(r' \. '), 'fanged': '.'},
    {'defanged': re.compile(r' dot ', re.IGNORECASE), 'fanged': '.'},
    
    # Colon defanging
    {'defanged': re.compile(r'\[:\]'), 'fanged': ':'},
    {'defanged': re.compile(r'\(:\)'), 'fanged': ':'},
    {'defanged': re.compile(r'\{:\}'), 'fanged': ':'},
    
    # Protocol separator defanging
    {'defanged': re.compile(r'\[:\/\/\]'), 'fanged': '://'},
    {'defanged': re.compile(r'\(:\/\/\)'), 'fanged': '://'},
    {'defanged': re.compile(r'\{:\/\/\}'), 'fanged': '://'},
    
    # Slash defanging
    {'defanged': re.compile(r'\[\/\]'), 'fanged': '/'},
    {'defanged': re.compile(r'\(\/\)'), 'fanged': '/'},
    {'defanged': re.compile(r'\{\/\}'), 'fanged': '/'},
    
    # At symbol defanging
    {'defanged': re.compile(r'\[@\]'), 'fanged': '@'},
    {'defanged': re.compile(r'\(@\)'), 'fanged': '@'},
    {'defanged': re.compile(r'\{@\}'), 'fanged': '@'},
    {'defanged': re.compile(r'\[at\]', re.IGNORECASE), 'fanged': '@'},
    {'defanged': re.compile(r'\(at\)', re.IGNORECASE), 'fanged': '@'},
    {'defanged': re.compile(r'\{at\}', re.IGNORECASE), 'fanged': '@'},
    {'defanged': re.compile(r' at ', re.IGNORECASE), 'fanged': '@'},
]

FANG_PATTERNS = [
    # Protocol fanging
    {'fanged': re.compile(r'http', re.IGNORECASE), 'defanged': 'hxxp'},
    {'fanged': re.compile(r'https', re.IGNORECASE), 'defanged': 'hxxps'},
    {'fanged': re.compile(r'ftp', re.IGNORECASE), 'defanged': 'fxp'},
    
    # Dot fanging
    {'fanged': re.compile(r'\.'), 'defanged': '[.]'},
    
    # Colon fanging (be careful with this one)
    {'fanged': re.compile(r':(?!\/\/)'), 'defanged': '[:]'},
    
    # Protocol separator fanging
    {'fanged': re.compile(r':\/\/'), 'defanged': '[://]'},
    
    # Slash fanging (only in URLs, be careful)
    {'fanged': re.compile(r'\/(?=\w)'), 'defanged': '[/]'},
    
    # At symbol fanging
    {'fanged': re.compile(r'@'), 'defanged': '[@]'},
]


def defang_ioc(ioc: str) -> str:
    """
    Defang an IOC by replacing dangerous characters with safe alternatives
    
    Args:
        ioc: The IOC to defang
        
    Returns:
        The defanged IOC
    """
    if not ioc or not isinstance(ioc, str):
        return ioc
    
    defanged = ioc.strip()
    
    for pattern in FANG_PATTERNS:
        defanged = pattern['fanged'].sub(pattern['defanged'], defanged)
    
    return defanged


def fang_ioc(defanged_ioc: str) -> str:
    """
    Fang (refang) an IOC by restoring original dangerous characters
    
    Args:
        defanged_ioc: The defanged IOC to restore
        
    Returns:
        The fanged (original) IOC
    """
    if not defanged_ioc or not isinstance(defanged_ioc, str):
        return defanged_ioc
    
    fanged = defanged_ioc.strip()
    
    for pattern in DEFANG_PATTERNS:
        fanged = pattern['defanged'].sub(pattern['fanged'], fanged)
    
    return fanged


def process_iocs(text: str, processor_func) -> List[str]:
    """
    Process multiple IOCs from text input
    
    Args:
        text: Text containing IOCs (one per line or separated by commas/spaces)
        processor_func: Function to apply to each IOC (defang_ioc or fang_ioc)
        
    Returns:
        Array of processed IOCs
    """
    if not text or not isinstance(text, str):
        return []
    
    # Split by lines first, then by common separators
    lines = text.split('\n')
    iocs = []
    
    for line in lines:
        # Split by commas, semicolons, or multiple spaces
        line_iocs = re.split(r'[,;]\s*|\s{2,}', line)
        line_iocs = [ioc.strip() for ioc in line_iocs if ioc.strip()]
        iocs.extend(line_iocs)
    
    return [processor_func(ioc) for ioc in iocs if ioc]


def get_ioc_types_from_extraction(extracted_data: Dict[str, Any]) -> Dict[str, List[str]]:
    """
    Create a mapping of IOC values to their types from extraction data
    
    Args:
        extracted_data: Data returned from extract_iocs
        
    Returns:
        Dictionary mapping IOC values to their types
    """
    ioc_type_map = {}
    
    type_mapping = {
        'ips': 'IP Address',
        'md5': 'MD5 Hash',
        'sha1': 'SHA1 Hash',
        'sha256': 'SHA256 Hash',
        'urls': 'URL',
        'domains': 'Domain',
        'emails': 'Email',
        'cves': 'CVE'
    }
    
    # Extract all IOCs with their types
    for key, values in extracted_data.items():
        if isinstance(values, list) and key in type_mapping:
            for ioc in values:
                if ioc not in ioc_type_map:
                    ioc_type_map[ioc] = []
                if type_mapping[key] not in ioc_type_map[ioc]:
                    ioc_type_map[ioc].append(type_mapping[key])
    
    return ioc_type_map


def batch_process_iocs(text: str, operation: str = 'defang') -> List[Dict[str, Any]]:
    """
    Batch process IOCs with type detection using the extractor service
    
    Args:
        text: Input text containing IOCs
        operation: 'defang' or 'fang'
        
    Returns:
        Array of objects with original, processed, and detected types
    """
    processor = defang_ioc if operation == 'defang' else fang_ioc
    iocs = process_iocs(text, lambda x: x)
    
    if not iocs:
        return []
    
    try:
        fanged_iocs = [fang_ioc(ioc) for ioc in iocs]
        combined_text = '\n'.join(fanged_iocs)
        extracted_data = extract_iocs(combined_text)
        ioc_type_map = get_ioc_types_from_extraction(extracted_data)
        
        results = []
        for original_ioc in iocs:
            processed_ioc = processor(original_ioc)
            fanged_ioc = fang_ioc(original_ioc)
            types = ioc_type_map.get(fanged_ioc, ['Unknown'])
            
            results.append({
                'original': original_ioc,
                'processed': processed_ioc,
                'types': types,
                'changed': original_ioc != processed_ioc
            })
        
        return results
        
    except Exception as e:
        # Fallback to basic processing without type detection
        results = []
        for original_ioc in iocs:
            processed_ioc = processor(original_ioc)
            
            results.append({
                'original': original_ioc,
                'processed': processed_ioc,
                'types': ['Unknown'],
                'changed': original_ioc != processed_ioc
            })
        
        return results
