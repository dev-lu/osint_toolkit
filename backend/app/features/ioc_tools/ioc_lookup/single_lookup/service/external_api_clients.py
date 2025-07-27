import requests
import json
import logging
from base64 import b64encode
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)


def handle_request_errors(service_name: str, response: requests.Response) -> Dict[str, Any]:
    """
    Centralized error handling for HTTP requests to external services.
    
    Args:
        service_name: Name of the service being called
        response: HTTP response object
        
    Returns:
        Dictionary containing parsed response data or error information
    """
    try:
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        status_code = http_err.response.status_code
        
        if status_code == 429:
            retry_after = http_err.response.headers.get('Retry-After', 'unknown')
            reset_time = http_err.response.headers.get('X-RateLimit-Reset', 'unknown')
            remaining = http_err.response.headers.get('X-RateLimit-Remaining', 'unknown')
            
            error_detail = f"Rate limit exceeded."
            if retry_after != 'unknown':
                error_detail += f" Retry after: {retry_after} seconds."
            if reset_time != 'unknown':
                error_detail += f" Limit resets at: {reset_time}."
            if remaining != 'unknown':
                error_detail += f" Remaining requests: {remaining}."
            
            logger.warning(f"Rate limit hit for {service_name}: {error_detail}")
            return {
                "error": status_code, 
                "message": f"{service_name} rate limit exceeded. Please try again later.",
                "retry_after": retry_after,
                "rate_limit_reset": reset_time,
                "rate_limit_remaining": remaining,
                "is_rate_limited": True
            }
        
        error_detail = f"HTTP {status_code} Error"
        
        try:
            if (http_err.response.content and 
                http_err.response.headers.get('content-type', '').startswith('application/json')):
                api_errors = http_err.response.json()
                if 'errors' in api_errors and api_errors['errors']:
                    error_detail = api_errors['errors'][0].get('detail', str(api_errors))
                elif 'message' in api_errors:
                    error_detail = api_errors['message']
                elif 'error' in api_errors and isinstance(api_errors['error'], str):
                    error_detail = api_errors['error']
            else:
                error_detail = http_err.response.text.strip() if http_err.response.text.strip() else f"HTTP {status_code} Error"
        except (json.JSONDecodeError, ValueError, AttributeError):
            error_detail = http_err.response.text.strip() if http_err.response.text.strip() else f"HTTP {status_code} Error"

        logger.warning(f"HTTP error in {service_name}: {error_detail}")
        return {"error": status_code, "message": f"{service_name} error: {error_detail}"}
        
    except requests.exceptions.RequestException as req_err:
        logger.error(f"Request error in {service_name}: {req_err}")
        return {"error": 503, "message": f"Could not connect to {service_name}: {req_err}"}
    except json.JSONDecodeError as json_err:
        logger.error(f"JSON decode error in {service_name}: {json_err}")
        return {"error": 500, "message": f"Failed to parse response from {service_name}."}


def abuseipdb_ip_check(ioc: str, apikey: str) -> Dict[str, Any]:
    """
    Perform IP reputation lookup using AbuseIPDB API.
    
    Args:
        ioc: IP address to check
        apikey: AbuseIPDB API key
        
    Returns:
        Dictionary containing lookup results or error information
    """
    if not apikey:
        return {"error": 401, "message": "AbuseIPDB API key is missing."}
    
    logger.debug(f"Checking IP {ioc} with AbuseIPDB")
    
    response = requests.get(
        url='https://api.abuseipdb.com/api/v2/check',
        params={'ipAddress': ioc, 'maxAgeInDays': '90', 'verbose': True},
        headers={'Accept': 'application/json', 'Key': apikey}
    )
    return handle_request_errors("AbuseIPDB", response)


def alienvaultotx(ioc: str, type: str, apikey: str) -> Dict[str, Any]:
    """
    Perform IOC lookup using AlienVault OTX API.
    
    Args:
        ioc: IOC value to lookup
        type: Type of IOC (ip, domain, url, hash)
        apikey: AlienVault OTX API key
        
    Returns:
        Dictionary containing lookup results or error information
    """
    if not apikey:
        return {"error": 401, "message": "AlienVault OTX API key is missing."}
    
    type_map = {'ip': 'IPv4', 'domain': 'domain', 'url': 'url', 'hash': 'file'}
    indicator_type = type_map.get(type, 'IPv4')
    
    logger.debug(f"Checking {indicator_type} {ioc} with AlienVault OTX")
    
    response = requests.get(
        url=f'https://otx.alienvault.com/api/v1/indicators/{indicator_type}/{ioc}/general',
        headers={'X-OTX-API-KEY': apikey}
    )
    return handle_request_errors("AlienVault OTX", response)


def check_bgpview(ioc: str) -> Dict[str, Any]:
    """
    Perform IP BGP information lookup using BGPView API.
    
    Args:
        ioc: IP address to check
        
    Returns:
        Dictionary containing BGP information or error information
    """
    logger.debug(f"Checking IP {ioc} with BGPView")
    
    response = requests.get(url=f'https://api.bgpview.io/ip/{ioc}')
    return handle_request_errors("BGPView", response)


def checkphish_ai(ioc: str, apikey: str) -> Dict[str, Any]:
    """
    Perform URL/domain phishing check using CheckPhish API.
    
    Args:
        ioc: URL or domain to check
        apikey: CheckPhish API key
        
    Returns:
        Dictionary containing scan results or error information
    """
    if not apikey:
        return {"error": 401, "message": "CheckPhish API key is missing."}

    logger.debug(f"Checking URL {ioc} with CheckPhish")
    
    response = requests.post(
        url='https://developers.checkphish.ai/api/neo/scan',
        json={'apiKey': apikey, 'urlInfo': {'url': ioc}}
    )
    return handle_request_errors("CheckPhish", response)


def crowdsec(ioc: str, apikey: str) -> Dict[str, Any]:
    """
    Perform IP reputation lookup using CrowdSec CTI API.
    
    Args:
        ioc: IP address to check
        apikey: CrowdSec API key
        
    Returns:
        Dictionary containing reputation data or error information
    """
    if not apikey:
        return {"error": 401, "message": "CrowdSec API key is missing."}
    
    logger.debug(f"Checking IP {ioc} with CrowdSec")
    
    response = requests.get(
        url=f'https://cti.api.crowdsec.net/v2/smoke/{ioc}',
        headers={'x-api-key': apikey}
    )
    return handle_request_errors("CrowdSec", response)


def crowdstrike_indicators_lookup(ioc: str, client_id: str, client_secret: str) -> Dict[str, Any]:
    """
    Perform IOC lookup using CrowdStrike Falcon Intelligence API.
    
    Args:
        ioc: IOC value to lookup
        client_id: CrowdStrike client ID
        client_secret: CrowdStrike client secret
        
    Returns:
        Dictionary containing intelligence data or error information
    """
    if not client_id or not client_secret:
        return {"error": 401, "message": "CrowdStrike credentials missing."}

    logger.debug(f"Authenticating with CrowdStrike")
    
    token_res = requests.post(
        url='https://api.crowdstrike.com/oauth2/token',
        data={'client_id': client_id, 'client_secret': client_secret},
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    token_data = handle_request_errors("CrowdStrike Auth", token_res)
    if 'error' in token_data:
        return token_data

    access_token = token_data.get('access_token')
    if not access_token:
        return {"error": 500, "message": "Failed to retrieve CrowdStrike access token."}
    
    logger.debug(f"Looking up IOC {ioc} with CrowdStrike")
    
    response = requests.get(
        url='https://api.crowdstrike.com/intel/combined/indicators/v1',
        params={'filter': f"indicator:'{ioc}'"},
        headers={'Authorization': f'Bearer {access_token}'}
    )
    return handle_request_errors("CrowdStrike", response)


def emailrep_email_check(ioc: str, apikey: str) -> Dict[str, Any]:
    """
    Perform email reputation lookup using EmailRep.io API.
    
    Args:
        ioc: Email address to check
        apikey: EmailRep.io API key
        
    Returns:
        Dictionary containing email reputation data or error information
    """
    if not apikey:
        return {"error": 401, "message": "EmailRep.io API key is missing."}
    
    logger.debug(f"Checking email {ioc} with EmailRep.io")
    
    response = requests.get(
        url=f'https://emailrep.io/{ioc}',
        headers={'Key': apikey, 'User-Agent': 'OSINT-Toolkit'}
    )
    return handle_request_errors("EmailRep.io", response)


def search_github(ioc: str, access_token: str) -> Dict[str, Any]:
    """
    Search for IOC mentions in GitHub code repositories.
    
    Args:
        ioc: IOC value to search for
        access_token: GitHub Personal Access Token
        
    Returns:
        Dictionary containing search results or error information
    """
    if not access_token:
        return {"error": 401, "message": "GitHub PAT is missing."}
    
    logger.debug(f"Searching for IOC {ioc} on GitHub")
    
    response = requests.get(
        url='https://api.github.com/search/code',
        params={'q': f'"{ioc}"'},
        headers={'Authorization': f'Bearer {access_token}', 'Accept': 'application/vnd.github.v3+json'}
    )
    return handle_request_errors("GitHub", response)


def haveibeenpwnd_email_check(ioc: str, apikey: str) -> Dict[str, Any]:
    """
    Check if email address appears in known data breaches using HIBP API.
    
    Args:
        ioc: Email address to check
        apikey: Have I Been Pwned API key
        
    Returns:
        Dictionary containing breach information or error information
    """
    if not apikey:
        return {"error": 401, "message": "HIBP API key is missing."}
    
    logger.debug(f"Checking email {ioc} with HIBP")
    
    response = requests.get(
        url=f'https://haveibeenpwned.com/api/v3/breachedaccount/{ioc}',
        headers={'hibp-api-key': apikey, 'User-Agent': 'OSINT-Toolkit'}
    )
    if response.status_code == 404:
        return {"message": "Not found in any breaches."}
    return handle_request_errors("HIBP", response)


def hunter_email_check(ioc: str, apikey: str) -> Dict[str, Any]:
    """
    Verify email address using Hunter.io API.
    
    Args:
        ioc: Email address to verify
        apikey: Hunter.io API key
        
    Returns:
        Dictionary containing verification results or error information
    """
    if not apikey:
        return {"error": 401, "message": "Hunter.io API key is missing."}

    logger.debug(f"Verifying email {ioc} with Hunter.io")
    
    response = requests.get(
        url=f'https://api.hunter.io/v2/email-verifier',
        params={'email': ioc, 'api_key': apikey}
    )
    return handle_request_errors("Hunter.io", response)


def ipqualityscore_ip_check(ioc: str, apikey: str) -> Dict[str, Any]:
    """
    Perform IP quality and fraud scoring using IPQualityScore API.
    
    Args:
        ioc: IP address to check
        apikey: IPQualityScore API key
        
    Returns:
        Dictionary containing quality score data or error information
    """
    if not apikey:
        return {"error": 401, "message": "IPQualityScore API key is missing."}
    
    logger.debug(f"Checking IP {ioc} with IPQualityScore")
    
    response = requests.get(url=f'https://www.ipqualityscore.com/api/json/ip/{apikey}/{ioc}')
    return handle_request_errors("IPQualityScore", response)


def maltiverse_check(ioc: str, endpoint: str, apikey: str) -> Dict[str, Any]:
    """
    Perform IOC lookup using Maltiverse API.
    
    Args:
        ioc: IOC value to lookup
        endpoint: API endpoint type (ip, hostname, url, sample)
        apikey: Maltiverse API key
        
    Returns:
        Dictionary containing threat intelligence data or error information
    """
    if not apikey:
        return {"error": 401, "message": "Maltiverse API key is missing."}
    
    logger.debug(f"Checking {endpoint} {ioc} with Maltiverse")
    
    response = requests.get(
        url=f'https://api.maltiverse.com/{endpoint}/{ioc}',
        headers={'Authorization': f'Bearer {apikey}'}
    )
    return handle_request_errors("Maltiverse", response)


def malwarebazaar_hash_check(ioc: str) -> Dict[str, Any]:
    """
    Perform hash lookup using MalwareBazaar API.
    
    Args:
        ioc: File hash to lookup
        
    Returns:
        Dictionary containing malware information or error information
    """
    logger.debug(f"Checking hash {ioc} with MalwareBazaar")
    
    response = requests.post(
        url='https://mb-api.abuse.ch/api/v1/',
        data={'query': 'get_info', 'hash': ioc}
    )
    return handle_request_errors("MalwareBazaar", response)


def mandiant_ioc_lookup(ioc: str, ioc_type: str, api_key: str, api_secret: str) -> Dict[str, Any]:
    """
    Perform IOC lookup using Mandiant Advantage API.
    
    Args:
        ioc: IOC value to lookup
        ioc_type: Type of IOC (ip, domain, url, hash, email)
        api_key: Mandiant API key
        api_secret: Mandiant API secret
        
    Returns:
        Dictionary containing threat intelligence data or error information
    """
    if not api_key or not api_secret:
        return {"error": 401, "message": "Mandiant credentials missing."}

    logger.debug(f"Authenticating with Mandiant")
    
    token_res = requests.post(
        url='https://api.intelligence.mandiant.com/token',
        data={'grant_type': 'client_credentials', 'client_id': api_key, 'client_secret': api_secret}
    )
    token_data = handle_request_errors("Mandiant Auth", token_res)
    if 'error' in token_data:
        return token_data

    access_token = token_data.get('access_token')
    if not access_token:
        return {"error": 500, "message": "Failed to retrieve Mandiant access token."}
    
    logger.debug(f"Looking up {ioc_type} {ioc} with Mandiant")
    
    response = requests.post(
        url='https://api.intelligence.mandiant.com/v4/indicator',
        headers={'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json', 'Accept': 'application/json'},
        json={"requests": [{"type": ioc_type, "value": ioc}]}
    )
    return handle_request_errors("Mandiant", response)


def search_nist_nvd(ioc: str, apikey: str) -> Dict[str, Any]:
    """
    Search for CVE information using NIST NVD API.
    
    Args:
        ioc: CVE identifier to lookup
        apikey: NIST NVD API key
        
    Returns:
        Dictionary containing CVE information or error information
    """
    if not apikey:
        return {"error": 401, "message": "NIST NVD API key is missing."}
    
    logger.debug(f"Looking up CVE {ioc} with NIST NVD")
    
    response = requests.get(
        url=f'https://services.nvd.nist.gov/rest/json/cves/2.0',
        params={'cveId': ioc},
        headers={'apiKey': apikey}
    )
    return handle_request_errors("NIST NVD", response)


def check_pulsedive(ioc: str, apikey: str) -> Dict[str, Any]:
    """
    Perform IOC lookup using Pulsedive API.
    
    Args:
        ioc: IOC value to lookup
        apikey: Pulsedive API key
        
    Returns:
        Dictionary containing threat intelligence data or error information
    """
    if not apikey:
        return {"error": 401, "message": "Pulsedive API key is missing."}

    logger.debug(f"Checking IOC {ioc} with Pulsedive")
    
    response = requests.get(
        url='https://pulsedive.com/api/info.php',
        params={'indicator': ioc, 'key': apikey, 'pretty': '1'}
    )
    return handle_request_errors("Pulsedive", response)


def search_reddit(ioc: str, client_id: str, client_secret: str) -> Dict[str, Any]:
    """
    Search for IOC mentions on Reddit using Reddit API.
    
    Args:
        ioc: IOC value to search for
        client_id: Reddit client ID
        client_secret: Reddit client secret
        
    Returns:
        Dictionary containing search results or error information
    """
    if not client_id or not client_secret:
        return {"error": 401, "message": "Reddit credentials missing."}

    logger.debug(f"Authenticating with Reddit")
    
    auth = requests.auth.HTTPBasicAuth(client_id, client_secret)
    token_res = requests.post(
        url='https://www.reddit.com/api/v1/access_token',
        data={'grant_type': 'client_credentials'},
        headers={'User-Agent': 'OSINT-Toolkit/0.1'},
        auth=auth
    )
    token_data = handle_request_errors("Reddit Auth", token_res)
    if 'error' in token_data:
        return token_data

    access_token = token_data.get('access_token')
    if not access_token:
        return {"error": 500, "message": "Failed to retrieve Reddit access token."}

    logger.debug(f"Searching for IOC {ioc} on Reddit")
    
    response = requests.get(
        url='https://oauth.reddit.com/search',
        params={'q': f'"{ioc}"', 'limit': 25},
        headers={'Authorization': f'bearer {access_token}', 'User-Agent': 'OSINT-Toolkit/0.1'}
    )
    return handle_request_errors("Reddit", response)


def safeBrowse_url_check(ioc: str, apikey: str) -> Dict[str, Any]:
    """
    Check URL safety using Google Safe Browsing API.
    
    Args:
        ioc: URL to check
        apikey: Google Safe Browsing API key
        
    Returns:
        Dictionary containing safety information or error information
    """
    if not apikey:
        return {"error": 401, "message": "Google Safe Browse API key is missing."}
    
    logger.debug(f"Checking URL {ioc} with Google Safe Browsing")
    
    payload = {
        "client": {"clientId": "osint-toolkit", "clientVersion": "1.0.0"},
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": ioc}]
        }
    }
    response = requests.post(
        url=f'https://safeBrowse.googleapis.com/v4/threatMatches:find?key={apikey}',
        json=payload
    )
    return handle_request_errors("Google Safe Browse", response)


def check_shodan(ioc: str, method: str, apikey: str) -> Dict[str, Any]:
    """
    Perform IP or domain lookup using Shodan API.
    
    Args:
        ioc: IP address or domain to lookup
        method: Lookup method ('ip' or 'domain')
        apikey: Shodan API key
        
    Returns:
        Dictionary containing host information or error information
    """
    if not apikey:
        return {"error": 401, "message": "Shodan API key is missing."}
    
    endpoint = 'host' if method == 'ip' else 'dns/domain'
    
    logger.debug(f"Checking {method} {ioc} with Shodan")
    
    response = requests.get(
        url=f'https://api.shodan.io/shodan/{endpoint}/{ioc}',
        params={'key': apikey}
    )
    return handle_request_errors("Shodan", response)


def threatfox_ip_check(ioc: str, apikey: str) -> Dict[str, Any]:
    """
    Perform IOC lookup using ThreatFox API.
    
    Args:
        ioc: IOC value to lookup
        apikey: ThreatFox API key
        
    Returns:
        Dictionary containing threat information or error information
    """
    if not apikey:
        return {"error": 401, "message": "ThreatFox API key is missing."}
    
    logger.debug(f"Checking IOC {ioc} with ThreatFox")
    
    response = requests.post(
        url='https://threatfox-api.abuse.ch/api/v1/',
        headers={'API-KEY': apikey},
        json={'query': 'search_ioc', 'search_term': ioc}
    )
    return handle_request_errors("ThreatFox", response)


def search_twitter(ioc: str, apikey: str) -> Dict[str, Any]:
    """
    Search for IOC mentions on Twitter/X using Twitter API v2.
    
    Args:
        ioc: IOC value to search for
        apikey: Twitter Bearer Token
        
    Returns:
        Dictionary containing search results or error information
    """
    if not apikey:
        return {"error": 401, "message": "Twitter Bearer Token is missing."}
    
    logger.debug(f"Searching for IOC {ioc} on Twitter/X")
    
    response = requests.get(
        url='https://api.twitter.com/2/tweets/search/recent',
        params={'query': f'"{ioc}" -is:retweet'},
        headers={'Authorization': f'Bearer {apikey}'}
    )
    return handle_request_errors("Twitter/X", response)


def urlhaus_url_check(ioc: str) -> Dict[str, Any]:
    """
    Perform URL lookup using URLhaus API.
    
    Args:
        ioc: URL to check
        
    Returns:
        Dictionary containing URL information or error information
    """
    logger.debug(f"Checking URL {ioc} with URLhaus")
    
    response = requests.post(
        url='https://urlhaus-api.abuse.ch/v1/url/',
        data={'url': ioc}
    )
    return handle_request_errors("URLhaus", response)


def urlscanio(ioc: str) -> Dict[str, Any]:
    """
    Search for IOC information using URLScan.io API.
    
    Args:
        ioc: IOC value to search for
        
    Returns:
        Dictionary containing scan information or error information
    """
    logger.debug(f"Searching for IOC {ioc} on URLScan.io")
    
    response = requests.get(
        url='https://urlscan.io/api/v1/search/',
        params={'q': f'page.ip:"{ioc}" OR page.domain:"{ioc}"'}
    )
    return handle_request_errors("URLScan.io", response)


def virustotal(ioc: str, type: str, apikey: str) -> Dict[str, Any]:
    """
    Perform IOC lookup using VirusTotal API v3.
    
    Args:
        ioc: IOC value to lookup
        type: Type of IOC (ip, domain, url, hash)
        apikey: VirusTotal API key
        
    Returns:
        Dictionary containing analysis results or error information
    """
    if not apikey:
        return {"error": 401, "message": "VirusTotal API key is missing."}

    type_map = {'ip': 'ip_addresses', 'domain': 'domains', 'url': 'urls', 'hash': 'files'}
    indicator_type = type_map.get(type, 'ip_addresses')
    
    if indicator_type == 'urls':
        ioc_safe = b64encode(ioc.encode()).decode().strip("=")
    else:
        ioc_safe = ioc
    
    logger.debug(f"Checking {type} {ioc} with VirusTotal")
        
    response = requests.get(
        url=f'https://www.virustotal.com/api/v3/{indicator_type}/{ioc_safe}',
        headers={'x-apikey': apikey}
    )
    return handle_request_errors("VirusTotal", response)
