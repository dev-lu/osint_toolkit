from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum

class ServiceTier(str, Enum):
    FREE = "free"
    PAID = "paid"
    FREEMIUM = "freemium"

@dataclass
class ServiceDefinition:
    """Service configuration definition"""
    name: str
    key: str  # Internal key used for API calls
    description: str
    documentation_url: str
    supported_ioc_types: List[str]
    required_keys: List[str]
    tier: ServiceTier
    category: str
    icon: str
    is_active: bool = True
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return asdict(self)

class ServiceCategory(str, Enum):
    THREAT_INTELLIGENCE = "threat_intelligence"
    SECURITY_SCANNING = "security_scanning"
    EMAIL_IDENTITY = "email_identity"
    DEVELOPMENT_RESEARCH = "development_research"
    SOCIAL_MEDIA = "social_media"
    NETWORK_INFRASTRUCTURE = "network_infrastructure"

# Service definitions
SERVICE_DEFINITIONS = {
    "abuseipdb": ServiceDefinition(
        name="AbuseIPDB",
        key="abuseipdb",
        description="Central repository for reporting and identifying malicious IP addresses associated with online attacks.",
        documentation_url="https://www.abuseipdb.com/api",
        supported_ioc_types=["IPv4", "IPv6"],
        required_keys=["abuseipdb"],
        tier=ServiceTier.FREE,
        category=ServiceCategory.THREAT_INTELLIGENCE,
        icon="aipdb_logo_small"
    ),
    "alienvault": ServiceDefinition(
        name="AlienVault OTX",
        key="alienvault",
        description="Open Threat Exchange - collaborative threat intelligence platform for sharing emerging threats and attack methods.",
        documentation_url="https://otx.alienvault.com/api",
        supported_ioc_types=["IPv4", "IPv6", "Domain", "URL", "MD5", "SHA1", "SHA256"],
        required_keys=["alienvault"],
        tier=ServiceTier.FREE,
        category=ServiceCategory.THREAT_INTELLIGENCE,
        icon="avotx_logo_small"
    ),
    "bgpview": ServiceDefinition(
        name="BGPView",
        key="bgpview",
        description="BGP routing information and ASN lookup service for network intelligence and IP address investigation.",
        documentation_url="https://bgpview.docs.apiary.io/",
        supported_ioc_types=["IPv4", "IPv6", "ASN"],
        required_keys=["bgpview"], 
        tier=ServiceTier.FREEMIUM,
        category=ServiceCategory.NETWORK_INFRASTRUCTURE,
        icon="bgpview_logo_small"
    ),
    "checkphishai": ServiceDefinition(
        name="CheckPhish.ai",
        key="checkphish",
        description="Free tool for domain monitoring, email link protection, and phishing detection to safeguard against typosquatting.",
        documentation_url="https://checkphish.ai/docs/checkphish-api/",
        supported_ioc_types=["IPv4", "Domain", "URL"],
        required_keys=["checkphishai"],
        tier=ServiceTier.FREE,
        category=ServiceCategory.SECURITY_SCANNING,
        icon="checkphish_logo_small"
    ),
    "crowdsec": ServiceDefinition(
        name="CrowdSec",
        key="crowdsec",
        description="Largest and most diverse cyber threat intelligence network delivering contextualized insights from global users.",
        documentation_url="https://app.crowdsec.net/settings/api-keys",
        supported_ioc_types=["IPv4"],
        required_keys=["crowdsec"],
        tier=ServiceTier.FREE,
        category=ServiceCategory.THREAT_INTELLIGENCE,
        icon="crowdsec_logo_small"
    ),
    "emailrepio": ServiceDefinition(
        name="EmailRep.io",
        key="emailrepio",
        description="Comprehensive email reputation service using hundreds of factors to assess email trustworthiness and risk.",
        documentation_url="https://emailrep.io/key",
        supported_ioc_types=["Email"],
        required_keys=["emailrepio"],
        tier=ServiceTier.FREE,
        category=ServiceCategory.EMAIL_IDENTITY,
        icon="emailrepio_logo_small"
    ),
    "github": ServiceDefinition(
        name="GitHub",
        key="github",
        description="Developer platform for creating, storing, managing and sharing code with distributed version control.",
        documentation_url="https://docs.github.com/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens",
        supported_ioc_types=["IPv4", "IPv6", "Domain", "URL", "Email", "MD5", "SHA1", "SHA256", "CVE"],
        required_keys=["github_pat"],
        tier=ServiceTier.FREE,
        category=ServiceCategory.DEVELOPMENT_RESEARCH,
        icon="github_logo_small"
    ),
    "safebrowse": ServiceDefinition(
        name="Google Safe Browsing",
        key="safeBrowse",
        description="Google's service protecting billions of devices by warning users about dangerous sites and malicious downloads.",
        documentation_url="https://developers.google.com/safe-browsing/v4/get-started",
        supported_ioc_types=["Domain", "URL"],
        required_keys=["safeBrowse"],
        tier=ServiceTier.FREE,
        category=ServiceCategory.SECURITY_SCANNING,
        icon="safeBrowse_logo_small"
    ),
    "haveibeenpwned": ServiceDefinition(
        name="Have I Been Pwned",
        key="haveibeenpwned",
        description="Search across multiple data breaches to check if email addresses or phone numbers have been compromised.",
        documentation_url="https://haveibeenpwned.com/API/v3#Authorisation",
        supported_ioc_types=["Email"],
        required_keys=["hibp_api_key"],
        tier=ServiceTier.PAID,
        category=ServiceCategory.EMAIL_IDENTITY,
        icon="hibp_logo_small"
    ),
    "hunterio": ServiceDefinition(
        name="Hunter.io",
        key="hunterio",
        description="Comprehensive email outreach platform for finding contact information and managing cold email campaigns.",
        documentation_url="https://hunter.io/api",
        supported_ioc_types=["Email"],
        required_keys=["hunterio_api_key"],
        tier=ServiceTier.FREEMIUM,
        category=ServiceCategory.EMAIL_IDENTITY,
        icon="hunterio_logo_small"
    ),
    "ipqualityscore": ServiceDefinition(
        name="IPQualityScore",
        key="ipqualityscore",
        description="Advanced fraud prevention and security platform measuring various risk signals to protect businesses.",
        documentation_url="https://www.ipqualityscore.com/documentation/overview",
        supported_ioc_types=["IPv4", "IPv6"],
        required_keys=["ipqualityscore"],
        tier=ServiceTier.FREEMIUM,
        category=ServiceCategory.SECURITY_SCANNING,
        icon="ipqualityscore_logo_small"
    ),
    "maltiverse": ServiceDefinition(
        name="Maltiverse",
        key="maltiverse",
        description="Threat intelligence broker aggregating data from 100+ public, private, and community sources.",
        documentation_url="https://app.swaggerhub.com/apis-docs/maltiverse/api/1.1",
        supported_ioc_types=["IPv4", "IPv6", "Domain", "URL", "MD5", "SHA1", "SHA256"],
        required_keys=["maltiverse"],
        tier=ServiceTier.FREEMIUM,
        category=ServiceCategory.THREAT_INTELLIGENCE,
        icon="maltiverse_logo_small"
    ),
    "malwarebazaar": ServiceDefinition(
        name="MalwareBazaar",
        key="malwarebazaar",
        description="Free malware sample repository by abuse.ch for malware analysis and threat research.",
        documentation_url="https://bazaar.abuse.ch/api/",
        supported_ioc_types=["MD5", "SHA1", "SHA256"],
        required_keys=['malwarebazaar'],
        tier=ServiceTier.FREEMIUM,
        category=ServiceCategory.THREAT_INTELLIGENCE,
        icon="malwarebazaar_logo_small"
    ),
    "nistnvd": ServiceDefinition(
        name="NIST NVD",
        key="nistnvd",
        description="U.S. government repository of standards-based vulnerability management data using SCAP protocol.",
        documentation_url="https://nvd.nist.gov/developers/request-an-api-key",
        supported_ioc_types=["CVE"],
        required_keys=["nist_nvd_api_key"],
        tier=ServiceTier.FREE,
        category=ServiceCategory.DEVELOPMENT_RESEARCH,
        icon="nistnvd_logo_small"
    ),
    "openai": ServiceDefinition(
        name="OpenAI",
        key="openai",
        description="Access to advanced large language models for AI-powered features and intelligent analysis.",
        documentation_url="https://platform.openai.com/account/api-keys",
        supported_ioc_types=["AI Features"],
        required_keys=["openai"],
        tier=ServiceTier.PAID,
        category=ServiceCategory.DEVELOPMENT_RESEARCH,
        icon="openai_logo_small"
    ),
    "pulsedive": ServiceDefinition(
        name="Pulsedive",
        key="pulsedive",
        description="Free threat intelligence platform for searching, scanning, and enriching IOCs from OSINT feeds.",
        documentation_url="https://pulsedive.com/api/",
        supported_ioc_types=["IPv4", "IPv6", "Domain", "URL", "MD5", "SHA1", "SHA256"],
        required_keys=["pulsedive"],
        tier=ServiceTier.FREE,
        category=ServiceCategory.THREAT_INTELLIGENCE,
        icon="pulsedive_logo_small"
    ),
    "reddit": ServiceDefinition(
        name="Reddit",
        key="reddit",
        description="Access Reddit's network of communities for threat intelligence and social media monitoring.",
        documentation_url="https://www.reddit.com/dev/api/",
        supported_ioc_types=["IPv4", "IPv6", "Domain", "URL", "Email", "MD5", "SHA1", "SHA256", "CVE"],
        required_keys=["reddit_cid", "reddit_cs"],
        tier=ServiceTier.FREE,
        category=ServiceCategory.SOCIAL_MEDIA,
        icon="reddit_logo_small"
    ),
    "shodan": ServiceDefinition(
        name="Shodan",
        key="shodan",
        description="World's first search engine for Internet-connected devices, providing comprehensive device intelligence.",
        documentation_url="https://developer.shodan.io/api/requirements",
        supported_ioc_types=["IPv4", "IPv6", "Domain", "URL"],
        required_keys=["shodan"],
        tier=ServiceTier.FREEMIUM,
        category=ServiceCategory.NETWORK_INFRASTRUCTURE,
        icon="shodan_logo_small"
    ),
    "threatfox": ServiceDefinition(
        name="ThreatFox",
        key="threatfox",
        description="Abuse.ch project focused on sharing indicators of compromise (IOCs) from various threat sources.",
        documentation_url="https://threatfox.abuse.ch/api/",
        supported_ioc_types=["IPv4", "IPv6", "Domain", "URL", "MD5", "SHA1", "SHA256"],
        required_keys=["threatfox"],
        tier=ServiceTier.FREE,
        category=ServiceCategory.THREAT_INTELLIGENCE,
        icon="threatfox_logo_small"
    ),
    "twitter": ServiceDefinition(
        name="Twitter/X",
        key="twitter",
        description="Access Twitter's API for social media threat intelligence and real-time monitoring.",
        documentation_url="https://developer.twitter.com/en/docs",
        supported_ioc_types=["IPv4", "IPv6", "Domain", "URL", "Email", "MD5", "SHA1", "SHA256", "CVE"],
        required_keys=["twitter_bearer_token"],
        tier=ServiceTier.FREE,
        category=ServiceCategory.SOCIAL_MEDIA,
        icon="twitter_logo_small"
    ),
    "urlhaus": ServiceDefinition(
        name="URLhaus",
        key="urlhaus",
        description="Free malicious URL repository by abuse.ch for tracking and analyzing malicious websites.",
        documentation_url="https://urlhaus-api.abuse.ch/",
        supported_ioc_types=["URL", "Domain"],
        required_keys=["urlhaus"],
        tier=ServiceTier.FREEMIUM,
        category=ServiceCategory.THREAT_INTELLIGENCE,
        icon="urlhaus_logo_small"
    ),
    "urlscanio": ServiceDefinition(
        name="URLScan.io",
        key="urlscanio",
        description="Website scanner specifically designed to identify suspicious and malicious URLs through detailed analysis.",
        documentation_url="https://urlscan.io/docs/api/",
        supported_ioc_types=["Domain", "URL", "IPv4"],
        required_keys=["urlscanio"],
        tier=ServiceTier.FREEMIUM,
        category=ServiceCategory.SECURITY_SCANNING,
        icon="urlscanio_logo_small"
    ),
    "virustotal": ServiceDefinition(
        name="VirusTotal",
        key="virustotal",
        description="Comprehensive malware analysis service using 70+ antivirus scanners and URL/domain blocklisting services.",
        documentation_url="https://developers.virustotal.com/reference/overview",
        supported_ioc_types=["IPv4", "IPv6", "Domain", "URL", "MD5", "SHA1", "SHA256"],
        required_keys=["virustotal"],
        tier=ServiceTier.FREEMIUM,
        category=ServiceCategory.THREAT_INTELLIGENCE,
        icon="vt_logo_small"
    ),
}

def get_service_definition(service_key: str) -> Optional[ServiceDefinition]:
    """Get a specific service definition by key"""
    return SERVICE_DEFINITIONS.get(service_key)

def get_all_service_definitions() -> Dict[str, ServiceDefinition]:
    """Get all service definitions"""
    return SERVICE_DEFINITIONS

def get_services_by_category(category: ServiceCategory) -> Dict[str, ServiceDefinition]:
    """Get all services in a specific category"""
    return {
        key: service for key, service in SERVICE_DEFINITIONS.items()
        if service.category == category
    }

def get_services_by_tier(tier: ServiceTier) -> Dict[str, ServiceDefinition]:
    """Get all services of a specific tier"""
    return {
        key: service for key, service in SERVICE_DEFINITIONS.items()
        if service.tier == tier
    }

def get_services_for_ioc_type(ioc_type: str) -> Dict[str, ServiceDefinition]:
    """Get all services that support a specific IOC type"""
    return {
        key: service for key, service in SERVICE_DEFINITIONS.items()
        if ioc_type in service.supported_ioc_types
    }

def get_required_keys_for_service(service_key: str) -> List[str]:
    """Get required API keys for a specific service"""
    service = get_service_definition(service_key)
    return service.required_keys if service else []