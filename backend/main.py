from fastapi import Depends, FastAPI, HTTPException, File, UploadFile, status, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import crud, models, schemas
from database.database import SessionLocal, engine
from database.models import Settings, ModuleSettings, NewsfeedSettings
from database.schemas import ModuleSettingsSchema, ModuleSettingsCreateSchema
import default_strings
import ioc_analyzer
import ioc_extractor
import email_analyzer
import domain_monitoring
import newsfeed
import ai_assistant
from typing import Dict, Any


models.Base.metadata.create_all(bind=engine)

# Allowed origins for avoiding CORS errors
origins = [
    "http://localhost:3000"
]

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===========================================================================
# Defaults
# ===========================================================================
# Write default general settings
def add_default_general_settings(db: Session):
    default_settings = Settings(id=0, darkmode=False, proxy_enabled=False, proxy_string='localhost')
    existing_settings = db.query(Settings).filter(Settings.id == 0).first()
    if not existing_settings:
        db.add(default_settings)
        db.commit()


# Write default module settings
def add_default_module_settings(db: Session):
    default_settings = [
        ModuleSettings(name="Newsfeed", description="", enabled=True),
        ModuleSettings(name="IOC Analyzer", description=default_strings.ioc_analyzer['description'], enabled=True),
        ModuleSettings(name="IOC Extractor", description=default_strings.ioc_extractor['description'], enabled=True),
        ModuleSettings(name="Email Analyzer", description=default_strings.email_analyzer['description'], enabled=True),
        ModuleSettings(name="Domain Monitoring", description=default_strings.domain_monitoring['description'], enabled=True),
        ModuleSettings(name="AI Assistant", description=default_strings.ai_assistant['description'], enabled=True),
        ModuleSettings(name="AI Assistant LA", description=default_strings.ai_assistant_la['description'], enabled=True),
        ModuleSettings(name="AI Assistant PA", description=default_strings.ai_assistant_pa['description'], enabled=True),
        ModuleSettings(name="AI Assistant CE", description=default_strings.ai_assistant_ce['description'], enabled=True),
        ModuleSettings(name="AI Assistant CDO", description=default_strings.ai_assistant_cdo['description'], enabled=True),
    ]
    for default in default_settings:
        existing_setting = db.query(ModuleSettings).filter(ModuleSettings.name == default.name).first()
        if existing_setting:
            pass
            #existing_setting.description = default.description
            #existing_setting.enabled = default.enabled
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
        NewsfeedSettings(name="Computerworld", url="https://www.computerworld.com/category/security/feed", icon="computerworld", enabled=True),
        NewsfeedSettings(name="CyberScoop", url="https://www.cyberscoop.com/news/threats/feed", icon="cyberscoop", enabled=True),
        NewsfeedSettings(name="Dark Reading", url="https://www.darkreading.com/rss_simple.asp", icon="darkreading", enabled=True),
        NewsfeedSettings(name="HackerNoon", url="https://hackernoon.com/tagged/cybersecurity/feed", icon="hackernoon", enabled=True),
        NewsfeedSettings(name="Helpnet Security", url="https://www.helpnetsecurity.com/feed/", icon="helpnetsecurity", enabled=True),
        NewsfeedSettings(name="Krebs on Security", url="https://krebsonsecurity.com/feed/", icon="krebsonsecurity", enabled=True),
        NewsfeedSettings(name="Security Magazine", url="https://www.securitymagazine.com/rss/topic/2236", icon="securitymagazine", enabled=True),
        NewsfeedSettings(name="SecurityWeek", url="https://feeds.feedburner.com/securityweek", icon="securityweek", enabled=True),
        NewsfeedSettings(name="TechCrunch", url="https://techcrunch.com/category/security/feed", icon="techcrunch", enabled=True),
        NewsfeedSettings(name="The Hacker News", url="https://feeds.feedburner.com/TheHackersNews", icon="thehackernews", enabled=True),
        NewsfeedSettings(name="threatpost", url="https://threatpost.com/feed/", icon="threatpost", enabled=True),
        NewsfeedSettings(name="The Record", url="https://therecord.media/feed", icon="therecord", enabled=True),
        NewsfeedSettings(name="The Register", url="https://www.theregister.co.uk/security/headlines.atom", icon="theregister", enabled=True),
        NewsfeedSettings(name="The Verge", url="https://www.theverge.com/rss/cyber-security/index.xml", icon="theverge", enabled=True),
        NewsfeedSettings(name="Wired", url="https://www.wired.com/feed/category/security/latest/rss", icon="wired", enabled=True),
        NewsfeedSettings(name="ZDNet", url="https://www.zdnet.com/topic/security/rss.xml", icon="zdnet", enabled=True)
    ]
    for feed in default_newsfeeds:
        existing_feed = db.query(NewsfeedSettings).filter(NewsfeedSettings.name == feed.name).first()
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
async def root(ioc:str = None):
    '''
    Get IP reputation from AlienVault OTX
    '''
    apikey = crud.get_apikey(name="alienvault", db=SessionLocal()).key
    return ioc_analyzer.alienvaultotx(ioc, 'ip', apikey, get_proxy())

@app.get("/api/hash/alienvault", tags=["Hashes"])
async def root(ioc:str = None):
    '''
    Get Hash reputation from AlienVault OTX
    '''
    apikey = crud.get_apikey(name="alienvault", db=SessionLocal()).key
    return ioc_analyzer.alienvaultotx(ioc, 'hash', apikey, get_proxy())

@app.get("/api/domain/alienvault", tags=["Domains"])
async def root(ioc:str = None):
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
async def root(ioc:str = None):
    '''
    Get IP reputation from Pulsedive
    '''
    apikey = crud.get_apikey(name="pulsedive", db=SessionLocal()).key
    return ioc_analyzer.check_pulsedive(ioc, apikey, get_proxy())

@app.get("/api/domain/pulsedive", tags=["Domains"])
async def root(ioc:str = None):
    '''
    Get Domains reputation from Pulsedive
    '''
    apikey = crud.get_apikey(name="pulsedive", db=SessionLocal()).key
    return ioc_analyzer.check_pulsedive(ioc, apikey, get_proxy())

@app.get("/api/hash/pulsedive", tags=["Hashes"])
async def root(ioc:str = None):
    '''
    Get Hash reputation from Pulsedive
    '''
    apikey = crud.get_apikey(name="pulsedive", db=SessionLocal()).key
    return ioc_analyzer.check_pulsedive(ioc, apikey, get_proxy())

@app.get("/api/domain/safebrowsing", tags=["Domains"])
async def root(ioc:str = None):
    '''
    Get domain reputation from Google Safe Browsing
    '''
    apikey = crud.get_apikey(name="safebrowsing", db=SessionLocal()).key
    return ioc_analyzer.safebrowsing_url_check(ioc, apikey, get_proxy())

@app.get("/api/url/safebrowsing", tags=["URLs"])
async def root(ioc:str = None):
    '''
    Get URL reputation from Google Safe Browsing
    '''
    apikey = crud.get_apikey(name="safebrowsing", db=SessionLocal()).key
    return ioc_analyzer.safebrowsing_url_check(ioc, apikey, get_proxy())

@app.get("/api/ip/shodan", tags=["IP addresses"])
async def root(ioc:str = None):
    '''
    Get information about IP from Shodan
    '''
    apikey = crud.get_apikey(name="shodan", db=SessionLocal()).key
    return ioc_analyzer.check_shodan(ioc, 'ip', apikey, get_proxy())

@app.get("/api/domain/shodan", tags=["Domains"])
async def root(ioc:str = None):
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

@app.get("/api/socialmedia/twitter/{ioc}", tags=["Social Media"])
async def root(ioc):
    '''
    Get latest Twitter Posts for IOC
    '''
    twitter_bearer_token = crud.get_apikey(name="twitter_bearer", db=SessionLocal()).key
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
    Get latest Mastodon Posts for IOC
    '''
    mastodon_token = crud.get_apikey(name="mastodon_bearer", db=SessionLocal()).key
    return ioc_analyzer.mastodon(ioc, mastodon_token, get_proxy())

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
async def root(ioc:str = None):
    '''
    Get IP reputation from VirusTotal
    '''
    apikey = crud.get_apikey(name="virustotal", db=SessionLocal()).key
    return ioc_analyzer.virustotal(ioc, 'ip', apikey, get_proxy())

@app.get("/api/domain/virustotal", tags=["Domains"])
async def root(ioc:str = None):
    '''
    Get Domain reputation from VirusTotal
    '''
    apikey = crud.get_apikey(name="virustotal", db=SessionLocal()).key
    return ioc_analyzer.virustotal(ioc, 'domain', apikey, get_proxy())

@app.get("/api/url/virustotal", tags=["URLs"])
async def root(ioc:str = None):
    '''
    Get URL reputation from VirusTotal
    '''
    apikey = crud.get_apikey(name="virustotal", db=SessionLocal()).key
    return ioc_analyzer.virustotal(ioc, 'url', apikey, get_proxy())

@app.get("/api/hash/virustotal", tags=["Hashes"])
async def root(ioc:str = None):
    '''
    Get hash reputation from VirusTotal
    '''
    apikey = crud.get_apikey(name="virustotal", db=SessionLocal()).key
    return ioc_analyzer.virustotal(ioc, 'hash', apikey, get_proxy())

@app.post("/api/aiassistant/loganalysis", tags=["AI Assistant"])
async def analyze_logs_endpoint(input: dict = Body(..., example={"input": "YOUR_INPUT_DATA"})):
    '''
    Analyze logdata with OpenAI
    '''
    inputdata = input["input"]
    apikey = crud.get_apikey(name="openai", db=SessionLocal()).key
    analysis_result = ai_assistant.ask_prompt(str(inputdata).encode('utf-8'), apikey, 'loganalysis', get_proxy())
    return {"analysis_result": analysis_result}

@app.post("/api/aiassistant/mailanalysis", tags=["AI Assistant"])
async def analyze_logs_endpoint(input: dict = Body(..., example={"input": "YOUR_INPUT_DATA"})):
    '''
    Analyze potential phishing mails with OpenAI
    '''
    inputdata = input["input"]
    apikey = crud.get_apikey(name="openai", db=SessionLocal()).key
    analysis_result = ai_assistant.ask_prompt(str(inputdata).encode('utf-8'), apikey, 'emailanalysis', get_proxy())
    return {"analysis_result": analysis_result}

@app.post("/api/aiassistant/codeexpert", tags=["AI Assistant"])
async def analyze_code_endpoint(input: dict = Body(..., example={"input": "YOUR_INPUT_DATA"})):
    '''
    Analyze source code with OpenAI
    '''
    inputdata = input["input"]
    apikey = crud.get_apikey(name="openai", db=SessionLocal()).key
    analysis_result = ai_assistant.ask_prompt(str(inputdata).encode('utf-8'), apikey, 'codeexpert', get_proxy())
    return {"analysis_result": analysis_result}


# ===========================================================================
# Routes for internal API calls
# ===========================================================================
# Create API key
@app.post("/api/apikeys/", response_model=schemas.ApikeySchema, tags=["OSINT Toolkit modules"], status_code=status.HTTP_201_CREATED)
def create_apikey(apikey: schemas.ApikeySchema, db: Session = Depends(get_db)):
    existing_apikey = crud.get_apikey(db, apikey.name)
    if existing_apikey:
        raise HTTPException(status_code=409, detail="Apikey already exists")
    db_apikey = crud.create_apikey(db, apikey)
    return db_apikey.to_dict()

# Delete API key by name
@app.delete("/api/apikeys", response_model=schemas.DeleteApikeyResponse, tags=["OSINT Toolkit modules"])
def delete_apikey(name: str, db: Session = Depends(get_db)):
    apikey = crud.get_apikey(db, name)
    if apikey is None:
        raise HTTPException(status_code=404, detail="Apikey not found")
    crud.delete_apikey(db=db, name=name)
    return schemas.DeleteApikeyResponse(apikey=schemas.ApikeySchema(**apikey.to_dict()), message="API key deleted successfully")

# Get all API keys
@app.get("/api/apikeys/", response_model=list[schemas.ApikeySchema], tags=["OSINT Toolkit modules"])
def read_apikeys(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    apikeys = crud.get_apikeys(db, skip=skip, limit=limit)
    if not apikeys:
        raise HTTPException(status_code=404, detail="No apikeys found")
    return [apikey.to_dict() for apikey in apikeys]

# Get API key by name
@app.get("/api/apikeys", response_model=schemas.ApikeySchema, tags=["OSINT Toolkit modules"])
def read_apikey(name: str, db: Session = Depends(get_db)):
    apikey = crud.get_apikey(db, name)
    if apikey is None:
        raise HTTPException(status_code=404, detail="Apikey not found")
    return apikey.to_dict()

# Get all API keys state
@app.get("/api/apikeys/is_active", response_model=Dict[str, Any], tags=["OSINT Toolkit modules"])
def get_all_apikeys_is_active(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    apikeys = crud.get_apikeys(db, skip=skip, limit=limit)
    return { apikey.name: apikey.is_active for apikey in apikeys }

# Get specific API key state
@app.get("/api/apikeys/{name}/is_active", response_model=bool, tags=["OSINT Toolkit modules"])
def get_apikey_is_active(name: str, db: Session = Depends(get_db)):
    apikey = crud.get_apikey(db, name)
    if apikey is None:
        raise HTTPException(status_code=404, detail="Apikey not found")
    return apikey.is_active

# Change API key state
@app.put("/api/apikeys/{name}/is_active", response_model=schemas.ApikeyStateResponse, tags=["OSINT Toolkit modules"])
def update_apikey_is_active(name: str, is_active: bool, db: Session = Depends(get_db)):
    apikey = crud.get_apikey(db, name)
    if apikey is None:
        raise HTTPException(status_code=404, detail="Apikey not found")
    apikey.is_active = is_active
    db.commit()
    return schemas.ApikeySchema(**apikey.to_dict())

# (File is for smaller files)
@app.post("/api/extractor/", tags=["OSINT Toolkit modules"])
async def create_file(file: bytes = File()):
    return ioc_extractor.extract_iocs(file)

# (UploadFile is for larger files)
@app.post("/api/mailanalyzer/", tags=["OSINT Toolkit modules"])
async def create_upload_file(file: UploadFile):
    return email_analyzer.analyze_email(file.file.read())


# ===========================================================================
# General settings routes
# ===========================================================================
# Get all Settings
@app.get("/api/settings/general/", response_model=list[schemas.SettingsSchema], tags=["OSINT Toolkit modules"])
def read_settings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    settings = crud.get_settings(db, skip=skip, limit=limit)
    if not settings:
        raise HTTPException(status_code=404, detail="No settings found")
    return settings

@app.put("/api/settings/general/", response_model=schemas.SettingsSchema, tags=["OSINT Toolkit modules"])
def update_settings(settings: schemas.SettingsSchema, db: Session = Depends(get_db)):
    existing_settings = crud.get_settings(db)
    if existing_settings:
        # update the existing settings
        updated_settings = crud.update_settings(db, existing_settings[0].id, settings)
        return updated_settings
    else:
        crud.create_settings(db, settings)
    
@app.put("/api/settings/general/darkmode/", response_model=schemas.SettingsSchema, tags=["OSINT Toolkit modules"])
def update_settings_darkmode(darkmode: bool, db: Session = Depends(get_db)):
    existing_settings = crud.get_settings(db)
    if existing_settings:
        # update the existing settings
        existing_settings[0].darkmode = darkmode
        db.commit()
        db.refresh(existing_settings[0])
        return existing_settings[0].to_dict()
    else:
        # create new settings
        new_settings = Settings(darkmode=darkmode)
        db.add(new_settings)
        db.commit()
        db.refresh(new_settings)
        return new_settings.to_dict()

@app.put("/api/settings/general/proxy_enabled/", response_model=schemas.SettingsSchema, tags=["OSINT Toolkit modules"])
def update_settings_proxy_enabled(proxy_enabled: bool, db: Session = Depends(get_db)):
    existing_settings = crud.get_settings(db)
    if existing_settings:
        # update the existing settings
        existing_settings[0].proxy_enabled = proxy_enabled
        db.commit()
        db.refresh(existing_settings[0])
        return existing_settings[0].to_dict()
    else:
        # create new settings
        new_settings = Settings(proxy_enabled=proxy_enabled)
        db.add(new_settings)
        db.commit()
        db.refresh(new_settings)
        return new_settings.to_dict()

@app.put("/api/settings/general/proxy_string/", response_model=schemas.SettingsSchema, tags=["OSINT Toolkit modules"])
def update_settings_proxy_string(proxy_string: str, db: Session = Depends(get_db)):
    existing_settings = crud.get_settings(db)
    if existing_settings:
        # update the existing settings
        existing_settings[0].proxy_string = proxy_string
        db.commit()
        db.refresh(existing_settings[0])
        return existing_settings[0].to_dict()
    else:
        # create new settings
        new_settings = Settings(proxy_string=proxy_string)
        db.add(new_settings)
        db.commit()
        db.refresh(new_settings)
        return new_settings.to_dict()

# ===========================================================================
# Module settings routes
# ===========================================================================
# Get all module settings
@app.get("/api/settings/modules/", response_model=list[schemas.ModuleSettingsSchema], tags=["OSINT Toolkit modules"])
def read_module_settings(db: Session = Depends(get_db)):
    settings = crud.get_all_modules_settings(db)
    if not settings:
        raise HTTPException(status_code=404, detail="No settings found")
    return [setting.to_dict() for setting in settings]

# Create module setting
@app.post("/api/settings/modules/", response_model=ModuleSettingsCreateSchema, tags=["OSINT Toolkit modules"])
def create_module_setting(setting: ModuleSettingsCreateSchema, db: Session = Depends(get_db)): 
    return crud.create_module_setting(db=db, settings=setting)

# Create or update module setting
@app.put("/api/settings/modules", response_model=ModuleSettingsSchema, tags=["OSINT Toolkit modules"])
def update_module_setting(module_setting_input: ModuleSettingsCreateSchema, db: Session = Depends(get_db)):
    module_setting = crud.get_specific_module_setting(db=db, module_name=module_setting_input.name)
    if not module_setting:
        #raise HTTPException(status_code=404, detail="Module setting not found")
        return crud.create_module_setting(db=db, settings=module_setting_input)
    return crud.update_module_setting(db=db, setting=module_setting, setting_input=module_setting_input)

@app.post("/api/settings/modules/disable/", response_model=ModuleSettingsSchema, tags=["OSINT Toolkit modules"])
def disable_setting(module_name: str, db: Session = Depends(get_db)):
    module_setting = crud.disable_module(db=db, module_name=module_name)
    if not module_setting:
        raise HTTPException(status_code=404, detail="Module setting not found")
    module_setting.enabled = False
    db.commit()
    db.refresh(module_setting)
    return module_setting.to_dict()

@app.post("/api/settings/modules/enable/", response_model=ModuleSettingsSchema, tags=["OSINT Toolkit modules"])
def disable_setting(module_name: str, db: Session = Depends(get_db)):
    module_setting = crud.disable_module(db=db, module_name=module_name)
    if not module_setting:
        raise HTTPException(status_code=404, detail="Module setting not found")
    module_setting.enabled = True
    db.commit()
    db.refresh(module_setting)
    return module_setting.to_dict()

@app.delete("/api/settings/modules/{module_name}", response_model=ModuleSettingsSchema, tags=["OSINT Toolkit modules"]) 
def delete_module_setting(module_name: str, db: Session = Depends(get_db)): 
    module_setting = crud.get_specific_module_setting(db=db, module_name=module_name) 
    if not module_setting: 
        raise HTTPException(status_code=404, detail="Module setting not found")
    return crud.delete_setting(db=db, setting_name=module_name)


# ===========================================================================
# Newsfeed settings routes
# ===========================================================================
# Get newsfeed settings
@app.get("/api/settings/modules/newsfeed/", response_model=list[schemas.NewsfeedSettingsSchema], tags=["OSINT Toolkit modules"])
def read_newsfeed_settings(db: Session = Depends(get_db)):
    settings = crud.get_newsfeed_settings(db)
    if not settings:
        raise HTTPException(status_code=404, detail="No settings found")
    return [setting.to_dict() for setting in settings]

# Create or update newsfeed settings
@app.put("/api/settings/modules/newsfeed/", response_model=schemas.NewsfeedSettingsSchema, tags=["OSINT Toolkit modules"])
def update_newsfeed_settings(settings: schemas.NewsfeedSettingsSchema, db: Session = Depends(get_db)):
    updated_settings = crud.update_newsfeed_settings(db, settings.name, settings)
    return updated_settings
    #settings_schema = schemas.NewsfeedSettingsSchema(**settings.dict())

# Delete Newsfeed
@app.delete("/api/settings/modules/newsfeed/{id}", response_model=schemas.NewsfeedSettingsSchema, tags=["OSINT Toolkit modules"])
def delete_newsfeed_settings(id: int, db: Session = Depends(get_db)):
    deleted_newsfeed = crud.delete_newsfeed_settings(db, id)
    if not deleted_newsfeed:
        raise HTTPException(status_code=404, detail="Newsfeed not found")
    return {'Success': 'Newsfeed deleted'}

@app.post("/api/settings/modules/newsfeed/enable", response_model=schemas.NewsfeedSettingsSchema, tags=["OSINT Toolkit modules"])
def disable_setting(feedName: str, db: Session = Depends(get_db)):
    newsfeed_state = crud.disable_feed(db=db, feedName=feedName)
    if not newsfeed_state:
        raise HTTPException(status_code=404, detail="Newsfeed not found")
    newsfeed_state.enabled = True
    db.commit()
    db.refresh(newsfeed_state)
    return newsfeed_state.to_dict()

@app.post("/api/settings/modules/newsfeed/disable", response_model=schemas.NewsfeedSettingsSchema, tags=["OSINT Toolkit modules"])
def disable_setting(feedName: str, db: Session = Depends(get_db)):
    newsfeed_state = crud.disable_feed(db=db, feedName=feedName)
    if not newsfeed_state:
        raise HTTPException(status_code=404, detail="Newsfeed not found")
    newsfeed_state.enabled = False
    db.commit()
    db.refresh(newsfeed_state)
    return newsfeed_state.to_dict()