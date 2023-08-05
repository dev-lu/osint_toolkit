from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import internal, external
from sqlalchemy.orm import Session
from database import models
from database.database import SessionLocal, engine
from database.models import Settings, ModuleSettings, NewsfeedSettings
import default_strings
import logging
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
app.include_router(external.router)

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
        id=0, darkmode=False)
    existing_settings = db.query(Settings).filter(Settings.id == 0).first()
    if not existing_settings:
        db.add(default_settings)
        db.commit()
        logging.info('Created default general settings')


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
    logging.info('Created default module settings')


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
    logging.info('Created default newsfeeds')


# Write default settings on application startup
@app.on_event("startup")
async def startup_event():
    db = SessionLocal()
    add_default_module_settings(db)
    add_default_general_settings(db)
    add_default_newsfeeds(db)
