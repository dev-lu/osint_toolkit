from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from routers import internal
from sqlalchemy.orm import Session
from database import crud, models
from database.database import SessionLocal, engine
from database.models import Settings, ModuleSettings, NewsfeedSettings
import default_strings
import ioc_analyzer
import domain_monitoring
import newsfeed
import ai_assistant
import os


models.Base.metadata.create_all(bind=engine)

# Allowed origins for avoiding CORS errors
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")

description = "## OSINT Toolkit interactive API documentation"

tags_metadata = [
    {
        "name": "IP addresses",
        "description": "Services to analyze IP addresses.",
    },
    {
        "name": "URLs",
        "description": "Services to analyze IP addresses.",
    },
    {
        "name": "Domains",
        "description": "Services to analyze domains.",
    },
    {
        "name": "Hashes",
        "description": "Services to analyze hashes.",
    },
    {
        "name": "Emails",
        "description": "Services to analyze emails.",
    },
    {
        "name": "Social Media",
        "description": "Search social media.",
    },
    {
        "name": "Multi",
        "description": "Services that can search for multiple IoC types.",
    },
    {
        "name": "CVEs",
        "description": "Search for vulnerabilities in form of CVE IDs.",
    },
    {
        "name": "AI Assistant",
        "description": "AI Assistant services.",
    },
    {
        "name": "OSINT Toolkit modules",
        "description": "Internal OSINT Toolkit modules.",
    }
]

app = FastAPI(
    title="OSINT Toolkit",
    description=description,
    version="0.1",
    contact={
        "name": "Lars Ursprung",
        "url": "https://github.com/dev-lu",
        "email": "larsursprung@gmail.comm",
    },
    license_info={
        "name": "MIT License",
        "url": "https://mit-license.org/",
    },
    openapi_tags=tags_metadata
)

app.include_router(internal.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===========================================================================
# Defaults
# ===========================================================================
# Write default general settings


def add_default_general_settings(db: Session):
    default_settings = Settings(
        id=0, darkmode=False, proxy_enabled=False, proxy_string='localhost')
    existing_settings = db.query(Settings).filter(Settings.id == 0).first()
    if not existing_settings:
        db.add(default_settings)
        db.commit()


# Write default module settings
def add_default_module_settings(db: Session):
    default_settings = [
        ModuleSettings(name="Newsfeed", description="", enabled=True),
        ModuleSettings(name="IOC Analyzer",
                       description=default_strings.ioc_analyzer['description'], enabled=True),
        ModuleSettings(name="IOC Extractor",
                       description=default_strings.ioc_extractor['description'], enabled=True),
        ModuleSettings(name="Email Analyzer",
                       description=default_strings.email_analyzer['description'], enabled=True),
        ModuleSettings(name="Domain Monitoring",
                       description=default_strings.domain_monitoring['description'], enabled=True),
        ModuleSettings(name="AI Assistant",
                       description=default_strings.ai_assistant['description'], enabled=True),
        ModuleSettings(name="AI Assistant LA",
                       description=default_strings.ai_assistant_la['description'], enabled=True),
        ModuleSettings(name="AI Assistant PA",
                       description=default_strings.ai_assistant_pa['description'], enabled=True),
        ModuleSettings(name="AI Assistant CE",
                       description=default_strings.ai_assistant_ce['description'], enabled=True),
        ModuleSettings(name="AI Assistant CDO",
                       description=default_strings.ai_assistant_cdo['description'], enabled=True),
        ModuleSettings(name="CVSS Calculator", description="", enabled=True),
    ]
    for default in default_settings:
        existing_setting = db.query(ModuleSettings).filter(
            ModuleSettings.name == default.name).first()
        if existing_setting:
            pass
            # existing_setting.description = default.description
            # existing_setting.enabled = default.enabled
        else:
            new_setting = ModuleSettings(
                name=default.name,
                description=default.description,
                enabled=default.enabled
            )
            db.add(new_setting)
    db.commit()


def add_default_newsfeeds(db: Session):
    default_newsfeeds = [
        NewsfeedSettings(name="Computerworld", url="https://www.computerworld.com/category/security/feed",
                         icon="computerworld", enabled=True),
        NewsfeedSettings(name="CyberScoop", url="https://www.cyberscoop.com/news/threats/feed",
                         icon="cyberscoop", enabled=True),
        NewsfeedSettings(name="Dark Reading", url="https://www.darkreading.com/rss_simple.asp",
                         icon="darkreading", enabled=True),
        NewsfeedSettings(name="HackerNoon", url="https://hackernoon.com/tagged/cybersecurity/feed",
                         icon="hackernoon", enabled=True),
        NewsfeedSettings(name="Helpnet Security", url="https://www.helpnetsecurity.com/feed/",
                         icon="helpnetsecurity", enabled=True),
        NewsfeedSettings(name="Krebs on Security", url="https://krebsonsecurity.com/feed/",
                         icon="krebsonsecurity", enabled=True),
        NewsfeedSettings(name="Security Magazine", url="https://www.securitymagazine.com/rss/topic/2236",
                         icon="securitymagazine", enabled=True),
        NewsfeedSettings(name="SecurityWeek", url="https://feeds.feedburner.com/securityweek",
                         icon="securityweek", enabled=True),
        NewsfeedSettings(name="TechCrunch", url="https://techcrunch.com/category/security/feed",
                         icon="techcrunch", enabled=True),
        NewsfeedSettings(name="The Hacker News", url="https://feeds.feedburner.com/TheHackersNews",
                         icon="thehackernews", enabled=True),
        NewsfeedSettings(name="threatpost", url="https://threatpost.com/feed/",
                         icon="threatpost", enabled=True),
        NewsfeedSettings(
            name="The Record", url="https://therecord.media/feed", icon="therecord", enabled=True),
        NewsfeedSettings(name="The Register", url="https://www.theregister.co.uk/security/headlines.atom",
                         icon="theregister", enabled=True),
        NewsfeedSettings(
            name="The Verge", url="https://www.theverge.com/rss/cyber-security/index.xml", icon="theverge", enabled=True),
        NewsfeedSettings(
            name="Wired", url="https://www.wired.com/feed/category/security/latest/rss", icon="wired", enabled=True),
        NewsfeedSettings(
            name="ZDNet", url="https://www.zdnet.com/topic/security/rss.xml", icon="zdnet", enabled=True)
    ]
    for feed in default_newsfeeds:
        existing_feed = db.query(NewsfeedSettings).filter(
            NewsfeedSettings.name == feed.name).first()
        if existing_feed:
            pass
        else:
            new_feed = NewsfeedSettings(
                name=feed.name,
                url=feed.url,
                icon=feed.icon,
                enabled=feed.enabled
            )
            db.add(new_feed)
    db.commit()


def get_proxy():
    db = SessionLocal()
    proxy_enabled = crud.get_settings(db)[0].proxy_enabled
    proxystring = crud.get_settings(db)[0].proxy_string
    if proxy_enabled and proxystring:
        proxies = {
            'http': proxystring,
            'https': proxystring
        }
    else:
        proxies = None
    return proxies


# Write default settings on application startup
@app.on_event("startup")
async def startup_event():
    db = SessionLocal()
    add_default_module_settings(db)
    add_default_general_settings(db)
    add_default_newsfeeds(db)


# ===========================================================================
# Routes for external API calls
# ===========================================================================
@app.get("/api/ip/abuseipdb/{ip}", tags=["IP addresses"])
async def root(ip):
    '''
    Get IP reputation from AbuseIPDB
    '''
    apikey = crud.get_apikey(name="abuseipdb", db=SessionLocal()).key
    return ioc_analyzer.abuseipdb_ip_check(ip, apikey, get_proxy())


@app.get("/api/ip/alienvault", tags=["IP addresses"])
async def root(ioc: str = None):
    '''
    Get IP reputation from AlienVault OTX
    '''
    apikey = crud.get_apikey(name="alienvault", db=SessionLocal()).key
    return ioc_analyzer.alienvaultotx(ioc, 'ip', apikey, get_proxy())


@app.get("/api/hash/alienvault", tags=["Hashes"])
async def root(ioc: str = None):
    '''
    Get Hash reputation from AlienVault OTX
    '''
    apikey = crud.get_apikey(name="alienvault", db=SessionLocal()).key
    return ioc_analyzer.alienvaultotx(ioc, 'hash', apikey, get_proxy())


@app.get("/api/domain/alienvault", tags=["Domains"])
async def root(ioc: str = None):
    '''
    Get DOMAIN reputation from AlienVault OTX
    '''
    apikey = crud.get_apikey(name="alienvault", db=SessionLocal()).key
    return ioc_analyzer.alienvaultotx(ioc, 'domain', apikey, get_proxy())


@app.get("/api/ip/bgpview/{ip}", tags=["IP addresses"])
async def root(ip):
    '''
    Get IP reputation from BGPView
    '''
    return ioc_analyzer.check_bgpview(ip, get_proxy())


@app.get("/api/ip/blocklist_de/{ip}", tags=["IP addresses"])
async def root(ip):
    '''
    Get IP reputation from Blocklist.de
    '''
    return ioc_analyzer.blocklist_de_ip_check(ip, get_proxy())


@app.get("/api/ip/crowdsec/{ip}", tags=["IP addresses"])
async def root(ip):
    '''
    Get IP reputation from CrowdSec
    '''
    apikey = crud.get_apikey(name="crowdsec", db=SessionLocal()).key
    return ioc_analyzer.crowdsec(ip, apikey)


@app.get("/api/ip/ipqualityscore/{ip}", tags=["IP addresses"])
async def root(ip):
    '''
    Get IP reputation from IPQualityScore
    '''
    apikey = crud.get_apikey(name="ipqualityscore", db=SessionLocal()).key
    return ioc_analyzer.ipqualityscore_ip_check(ip, apikey, get_proxy())


@app.get("/api/ip/maltiverse/{ip}", tags=["IP addresses"])
async def root(ip):
    '''
    Get IP reputation from Maltiverse
    '''
    apikey = crud.get_apikey(name="maltiverse", db=SessionLocal()).key
    return ioc_analyzer.maltiverse_check(ip, "ip", apikey, get_proxy())


@app.get("/api/domain/maltiverse/{hostname}", tags=["Domains"])
async def root(hostname):
    '''
    Get hostname reputation from Maltiverse
    '''
    apikey = crud.get_apikey(name="maltiverse", db=SessionLocal()).key
    return ioc_analyzer.maltiverse_check(hostname, "hostname", apikey, get_proxy())


@app.get("/api/url/checkphish/{url}", tags=["URLs"])
async def root(url):
    '''
    Get URL reputation from CheckPhish
    '''
    apikey = crud.get_apikey(name="checkphishai", db=SessionLocal()).key
    return ioc_analyzer.checkphish_ai(url, apikey)


@app.get("/api/domain/checkphish/{url}", tags=["Domains"])
async def root(url):
    '''
    Get URL reputation from CheckPhish
    '''
    apikey = crud.get_apikey(name="checkphishai", db=SessionLocal()).key
    return ioc_analyzer.checkphish_ai(url, apikey)


@app.get("/api/ip/checkphish/{url}", tags=["IP addresses"])
async def root(url):
    '''
    Get URL reputation from CheckPhish
    '''
    apikey = crud.get_apikey(name="checkphishai", db=SessionLocal()).key
    return ioc_analyzer.checkphish_ai(url, apikey)


@app.get("/api/url/maltiverse/{url}", tags=["URLs"])
async def root(url):
    '''
    Get URL reputation from Maltiverse
    '''
    apikey = crud.get_apikey(name="maltiverse", db=SessionLocal()).key
    return ioc_analyzer.maltiverse_check(url, "url", apikey, get_proxy())


@app.get("/api/hash/maltiverse/{hash}", tags=["Hashes"])
async def root(hash):
    '''
    Get hash reputation from Maltiverse (SHA256 only)
    '''
    apikey = crud.get_apikey(name="maltiverse", db=SessionLocal()).key
    return ioc_analyzer.maltiverse_check(hash, "sample", apikey, get_proxy())


@app.get("/api/hash/malwarebazaar/{hash}", tags=["Hashes"])
async def root(hash):
    '''
    Get hash reputation from MalwareBazaar
    '''
    return ioc_analyzer.malwarebazaar_hash_check(hash, get_proxy())


@app.get("/api/newsfeed", tags=["OSINT Toolkit modules"])
async def root():
    '''
    Get news articles from various RSS feeds
    '''
    return newsfeed.get_news()


@app.get("/api/ip/pulsedive", tags=["IP addresses"])
async def root(ioc: str = None):
    '''
    Get IP reputation from Pulsedive
    '''
    apikey = crud.get_apikey(name="pulsedive", db=SessionLocal()).key
    return ioc_analyzer.check_pulsedive(ioc, apikey, get_proxy())


@app.get("/api/domain/pulsedive", tags=["Domains"])
async def root(ioc: str = None):
    '''
    Get Domains reputation from Pulsedive
    '''
    apikey = crud.get_apikey(name="pulsedive", db=SessionLocal()).key
    return ioc_analyzer.check_pulsedive(ioc, apikey, get_proxy())


@app.get("/api/hash/pulsedive", tags=["Hashes"])
async def root(ioc: str = None):
    '''
    Get Hash reputation from Pulsedive
    '''
    apikey = crud.get_apikey(name="pulsedive", db=SessionLocal()).key
    return ioc_analyzer.check_pulsedive(ioc, apikey, get_proxy())


@app.get("/api/domain/safebrowsing", tags=["Domains"])
async def root(ioc: str = None):
    '''
    Get domain reputation from Google Safe Browsing
    '''
    apikey = crud.get_apikey(name="safebrowsing", db=SessionLocal()).key
    return ioc_analyzer.safebrowsing_url_check(ioc, apikey, get_proxy())


@app.get("/api/url/safebrowsing", tags=["URLs"])
async def root(ioc: str = None):
    '''
    Get URL reputation from Google Safe Browsing
    '''
    apikey = crud.get_apikey(name="safebrowsing", db=SessionLocal()).key
    return ioc_analyzer.safebrowsing_url_check(ioc, apikey, get_proxy())


@app.get("/api/ip/shodan", tags=["IP addresses"])
async def root(ioc: str = None):
    '''
    Get information about IP from Shodan
    '''
    apikey = crud.get_apikey(name="shodan", db=SessionLocal()).key
    return ioc_analyzer.check_shodan(ioc, 'ip', apikey, get_proxy())


@app.get("/api/domain/shodan", tags=["Domains"])
async def root(ioc: str = None):
    '''
    Get information about a domain from Shodan
    '''
    apikey = crud.get_apikey(name="shodan", db=SessionLocal()).key
    return ioc_analyzer.check_shodan(ioc, 'domain', apikey, get_proxy())


@app.get("/api/ip/threatfox/{ip}", tags=["IP addresses"])
async def root(ip):
    '''
    Get IP reputation from ThreatFox
    '''
    apikey = crud.get_apikey(name="threatfox", db=SessionLocal()).key
    return ioc_analyzer.threatfox_ip_check(ip, apikey, get_proxy())


@app.get("/api/email/hunterio/{email}", tags=["Emails"])
async def root(email):
    '''
    Get email reputation from Hunter.io
    '''
    apikey = crud.get_apikey(name="hunterio", db=SessionLocal()).key
    return ioc_analyzer.hunter_email_check(email, apikey, get_proxy())


@app.get("/api/email/emailrepio/{email}", tags=["Emails"])
async def root(email):
    '''
    Get email reputation from emailrep.io
    '''
    apikey = crud.get_apikey(name="emailrepio", db=SessionLocal()).key
    return ioc_analyzer.emailrep_email_check(email, apikey, get_proxy())


@app.get("/api/email/haveibeenpwnd/{email}", tags=["Emails"])
async def root(email):
    '''
    Get email reputation from Have I Been Pwnd
    '''
    apikey = crud.get_apikey(name="hibp", db=SessionLocal()).key
    return ioc_analyzer.haveibeenpwnd_email_check(email, apikey, get_proxy())


@app.get("/api/cve/nist_nvd/{cve}", tags=["CVEs"])
async def root(cve):
    '''
    Get information about a CVE from the NIST NVD
    '''
    if not hasattr(crud.get_apikey(name="nist_nvd", db=SessionLocal()), 'key'):
        return {"error": "No API key found for NIST NVD"}
    else:
        apikey = crud.get_apikey(name="nist_nvd", db=SessionLocal()).key
    return ioc_analyzer.search_nist_nvd(cve, apikey, get_proxy())


@app.get("/api/socialmedia/twitter/{ioc}", tags=["Social Media"])
async def root(ioc):
    '''
    Get latest Twitter Posts for IOC
    '''
    twitter_bearer_token = crud.get_apikey(
        name="twitter_bearer", db=SessionLocal()).key
    return ioc_analyzer.search_twitter(ioc, twitter_bearer_token)


@app.get("/api/socialmedia/reddit/{ioc}", tags=["Social Media"])
async def root(ioc):
    '''
    Get latest Reddit Posts for IOC
    '''
    reddit_cs = crud.get_apikey(name="reddit_cs", db=SessionLocal()).key
    reddit_cid = crud.get_apikey(name="reddit_cid", db=SessionLocal()).key
    return ioc_analyzer.search_reddit(ioc=ioc, client_secret=reddit_cs, client_id=reddit_cid)


@app.get("/api/socialmedia/mastodon/{ioc}", tags=["Social Media"])
async def roof(ioc):
    '''
    Get latest Mastodon Posts (ioc.exchange) for a specific IOC
    '''
    return ioc_analyzer.mastodon(ioc)


@app.get("/api/url/urlhaus/{url}", tags=["URLs"])
async def root(url):
    '''
    Get URL reputation from URLhaus
    '''
    return ioc_analyzer.urlhaus_url_check(url, get_proxy())


@app.get("/api/url/urlscanio/{domain}", tags=["URLs"])
async def root(domain):
    '''
    Get URL reputation from URLscan.io
    '''
    return domain_monitoring.urlscanio(domain, get_proxy())


@app.get("/api/ip/virustotal", tags=["IP addresses"])
async def root(ioc: str = None):
    '''
    Get IP reputation from VirusTotal
    '''
    apikey = crud.get_apikey(name="virustotal", db=SessionLocal()).key
    return ioc_analyzer.virustotal(ioc, 'ip', apikey, get_proxy())


@app.get("/api/domain/virustotal", tags=["Domains"])
async def root(ioc: str = None):
    '''
    Get Domain reputation from VirusTotal
    '''
    apikey = crud.get_apikey(name="virustotal", db=SessionLocal()).key
    return ioc_analyzer.virustotal(ioc, 'domain', apikey, get_proxy())


@app.get("/api/url/virustotal", tags=["URLs"])
async def root(ioc: str = None):
    '''
    Get URL reputation from VirusTotal
    '''
    apikey = crud.get_apikey(name="virustotal", db=SessionLocal()).key
    return ioc_analyzer.virustotal(ioc, 'url', apikey, get_proxy())


@app.get("/api/hash/virustotal", tags=["Hashes"])
async def root(ioc: str = None):
    '''
    Get hash reputation from VirusTotal
    '''
    apikey = crud.get_apikey(name="virustotal", db=SessionLocal()).key
    return ioc_analyzer.virustotal(ioc, 'hash', apikey, get_proxy())


@app.get("/api/multi/github", tags=["Multi"])
async def root(ioc: str = None):
    '''
    Get search results from GitHub
    '''
    apikey = crud.get_apikey(name="github", db=SessionLocal()).key
    return ioc_analyzer.search_github(ioc=ioc, access_token=apikey)


@app.post("/api/aiassistant/loganalysis", tags=["AI Assistant"])
async def analyze_logs_endpoint(input: dict = Body(..., example={"input": "YOUR_INPUT_DATA"})):
    '''
    Analyze logdata with OpenAI
    '''
    inputdata = input["input"]
    apikey = crud.get_apikey(name="openai", db=SessionLocal()).key
    analysis_result = ai_assistant.ask_prompt(
        str(inputdata).encode('utf-8'), apikey, 'loganalysis', get_proxy())
    return {"analysis_result": analysis_result}


@app.post("/api/aiassistant/mailanalysis", tags=["AI Assistant"])
async def analyze_logs_endpoint(input: dict = Body(..., example={"input": "YOUR_INPUT_DATA"})):
    '''
    Analyze potential phishing mails with OpenAI
    '''
    inputdata = input["input"]
    apikey = crud.get_apikey(name="openai", db=SessionLocal()).key
    analysis_result = ai_assistant.ask_prompt(
        str(inputdata).encode('utf-8'), apikey, 'emailanalysis', get_proxy())
    return {"analysis_result": analysis_result}


@app.post("/api/aiassistant/codeexpert", tags=["AI Assistant"])
async def analyze_code_endpoint(input: dict = Body(..., example={"input": "YOUR_INPUT_DATA"})):
    '''
    Analyze source code with OpenAI
    '''
    inputdata = input["input"]
    apikey = crud.get_apikey(name="openai", db=SessionLocal()).key
    analysis_result = ai_assistant.ask_prompt(
        str(inputdata).encode('utf-8'), apikey, 'codeexpert', get_proxy())
    return {"analysis_result": analysis_result}
