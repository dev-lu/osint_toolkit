import re

IOC_TYPES = {
    'IPV4': 'IPv4',
    'IPV6': 'IPv6',
    'MD5': 'MD5',
    'SHA1': 'SHA1',
    'SHA256': 'SHA256',
    'URL': 'URL',
    'DOMAIN': 'Domain',
    'EMAIL': 'Email',
    'CVE': 'CVE',
    'UNKNOWN': 'unknown',
}

IOC_TYPE_PATTERNS = {
    IOC_TYPES['MD5']: re.compile(r"^[a-f0-9]{32}$", re.IGNORECASE),
    IOC_TYPES['SHA1']: re.compile(r"^[a-f0-9]{40}$", re.IGNORECASE),
    IOC_TYPES['SHA256']: re.compile(r"^[a-f0-9]{64}$", re.IGNORECASE),
    IOC_TYPES['IPV4']: re.compile(r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"),
    IOC_TYPES['IPV6']: re.compile(r"(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))", re.IGNORECASE),
    IOC_TYPES['URL']: re.compile(r"^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$", re.IGNORECASE),
    IOC_TYPES['DOMAIN']: re.compile(r"^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$"),
    IOC_TYPES['EMAIL']: re.compile(r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"),
    IOC_TYPES['CVE']: re.compile(r"^CVE-[0-9]{4}-[0-9]{4,}$", re.IGNORECASE),
}

def determine_ioc_type(ioc: str) -> str:
    """
    Determines the type of an Indicator of Compromise (IOC).
    The order of checks is important to prevent misclassification (e.g., URL before Domain).
    """
    ioc = ioc.strip()
    
    if IOC_TYPE_PATTERNS[IOC_TYPES['MD5']].match(ioc):
        return IOC_TYPES['MD5']
    if IOC_TYPE_PATTERNS[IOC_TYPES['SHA1']].match(ioc):
        return IOC_TYPES['SHA1']
    if IOC_TYPE_PATTERNS[IOC_TYPES['SHA256']].match(ioc):
        return IOC_TYPES['SHA256']
        
    if IOC_TYPE_PATTERNS[IOC_TYPES['IPV4']].match(ioc):
        return IOC_TYPES['IPV4']
    if IOC_TYPE_PATTERNS[IOC_TYPES['IPV6']].match(ioc):
        return IOC_TYPES['IPV6']
        
    if IOC_TYPE_PATTERNS[IOC_TYPES['CVE']].match(ioc):
        return IOC_TYPES['CVE']

    if IOC_TYPE_PATTERNS[IOC_TYPES['URL']].match(ioc):
        return IOC_TYPES['URL']
    if IOC_TYPE_PATTERNS[IOC_TYPES['DOMAIN']].match(ioc):
        return IOC_TYPES['DOMAIN']
        
    if IOC_TYPE_PATTERNS[IOC_TYPES['EMAIL']].match(ioc):
        return IOC_TYPES['EMAIL']
        
    return IOC_TYPES['UNKNOWN']