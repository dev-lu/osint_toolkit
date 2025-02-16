import logging
import os
from typing import List
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from routers import external, newsfeed, ai_templates
from routers import newsfeed as newsfeed_routes
from routers.internal import (
    api_key_settings, general_settings, module_settings,
    mail_analyzer, ioc_extractor, cti_settings_routes, alerts_routes
)
from database import models, crud
from database.database import SessionLocal, engine
from database.models import Settings, ModuleSettings, NewsfeedSettings
from database.schemas import NewsArticleSchema, ai_template_schema
from utils import default_llm_templates
from utils.scheduler import start_scheduler, shutdown_scheduler
from modules import newsfeed

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Create database tables
try:
    models.Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Failed to create database tables: {str(e)}")
    raise

# API Configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
description = "## OSINT Toolkit interactive API documentation"

tags_metadata = [
    {"name": "AI Templates", "description": ""},
    {"name": "Alerts", "description": ""},
    {"name": "IOC Lookup", "description": "Services to lookup Indicators of Compromise."},
    {"name": "IOC Extractor", "description": ""},
    {"name": "Mail Analyzer", "description": ""},
    {"name": "Newsfeed", "description": ""},
    {"name": "Settings", "description": ""},
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Application starting up...")
    db = SessionLocal()
    try:
        await initialize_defaults(db)
        start_scheduler()
        logger.info("Application startup completed successfully")
    except Exception as e:
        logger.error(f"Startup failed: {str(e)}")
        raise
    finally:
        db.close()
    
    yield
    
    # Shutdown
    logger.info("Application shutting down...")
    try:
        shutdown_scheduler()
        logger.info("Application shutdown completed successfully")
    except Exception as e:
        logger.error(f"Shutdown error: {str(e)}")

app = FastAPI(
    title="OSINT Toolkit",
    description=description,
    version="0.1",
    contact={
        "name": "Lars Ursprung",
        "url": "https://github.com/dev-lu",
        "email": "larsursprung@gmail.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://mit-license.org/",
    },
    openapi_tags=tags_metadata,
    swagger_ui_parameters={"docExpansion": "none"},
    lifespan=lifespan
)

# Router includes
routers = [
    external.router,
    alerts_routes.router,
    newsfeed_routes.internal.router,
    newsfeed_routes.external.router,
    api_key_settings.router,
    general_settings.router,
    module_settings.router,
    mail_analyzer.router,
    ioc_extractor.router,
    cti_settings_routes.router,
    ai_templates.router
]

for router in routers:
    app.include_router(router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def add_default_general_settings(db: Session) -> None:
    """Add default general settings if they don't exist."""
    try:
        existing_settings = db.query(Settings).filter(Settings.id == 0).first()
        if not existing_settings:
            default_settings = Settings(id=0, darkmode=True)
            db.add(default_settings)
            db.commit()
            logger.info('Created default general settings')
    except SQLAlchemyError as e:
        logger.error(f'Failed to add default general settings: {str(e)}')
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to add default settings")

async def add_default_module_settings(db: Session) -> None:
    """Add default module settings if they don't exist."""
    default_modules = [
        ("Newsfeed", True),
        ("IOC Lookup", True),
        ("Email Analyzer", True),
        ("IOC Extractor", True),
        ("Domain Finder", True),
        ("AI Templates", True),
        ("CVSS Calculator", True),
        ("Detection Rules", True)
    ]
    
    try:
        for name, enabled in default_modules:
            existing = db.query(ModuleSettings).filter(ModuleSettings.name == name).first()
            if not existing:
                db.add(ModuleSettings(name=name, enabled=enabled))
        
        db.commit()
        logger.info('Default module settings checked/created')
    except SQLAlchemyError as e:
        logger.error(f'Failed to add default module settings: {str(e)}')
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to add module settings")

async def add_default_newsfeeds(db: Session) -> None:
    """Add default newsfeeds if they don't exist."""
    default_newsfeeds = [
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
        NewsfeedSettings(name="The DFIR Report", url="https://thedfirreport.com/feed/atom",
                         icon="thedfirreport", enabled=True),               
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
    
    try:
        for feed in default_newsfeeds:
            existing_feed = db.query(NewsfeedSettings).filter(
                NewsfeedSettings.name == feed.name).first()
            if not existing_feed:
                db.add(NewsfeedSettings(
                    name=feed.name,
                    url=feed.url,
                    icon=feed.icon,
                    enabled=feed.enabled
                ))
        db.commit()
        logger.info('Created default newsfeeds')
    except SQLAlchemyError as e:
        logger.error(f'Failed to add default newsfeeds: {str(e)}')
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to add default newsfeeds")

async def seed_default_llm_templates(db: Session) -> None:
    """Seed default LLM templates if they don't exist."""
    try:
        existing_templates = db.query(models.ai_template_model.AITemplate).first()
        if not existing_templates:
            for temp_data in default_llm_templates.DEFAULT_TEMPLATES:
                template_create = ai_template_schema.AITemplateCreate(**temp_data)
                crud.ai_template_crud.create_template(db, template_create)
            db.commit()
            logger.info("Default templates seeded successfully")
    except Exception as e:
        logger.error(f"Failed to seed default templates: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to seed default templates")

async def initialize_defaults(db: Session) -> None:
    """Initialize all default settings concurrently."""
    try:
        await asyncio.gather(
            add_default_general_settings(db),
            add_default_module_settings(db),
            add_default_newsfeeds(db),
            seed_default_llm_templates(db)
        )
    except Exception as e:
        logger.error(f"Failed to initialize defaults: {str(e)}")
        raise