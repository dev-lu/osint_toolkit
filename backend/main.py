import logging
import os
from typing import List
import asyncio
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

import app.core.config.fastapi_config as fastapi_config

from app.core import healthcheck
from app.core.database import SessionLocal, engine, Base
from app.core.scheduler import start_scheduler, shutdown_scheduler
from app.core.settings.api_keys.routers import api_keys_settings_routes, service_config_routes
from app.core.settings.modules.routers import modules_settings_routes
from app.core.settings.general.routers import general_settings_routes
from app.core.settings.keywords.routers import keywords_settings_routes
from app.core.settings.cti_profile.routers import cti_profile_settings_routes
from app.core.settings.api_keys.crud import api_keys_settings_crud

from app.features.llm_templates.routers import internal_llm_templates_routes
from app.features.llm_templates.schemas import AITemplateCreate
from app.features.llm_templates.models import AITemplate
from app.features.llm_templates.crud import create_template
from app.features.llm_templates.utils import default_llm_templates
from app.core.settings.api_keys.config.create_defaults import add_default_api_keys

from app.features.domain_lookup.routers import external_domain_lookup_routes
from app.features.email_analyzer.routers import internal_email_analyzer_routes
from app.features.ioc_tools.ioc_extractor.routers import internal_ioc_extractor_routes
from app.features.ioc_tools.ioc_defanger.routers import internal_defang_routes
from app.features.ioc_tools.ioc_lookup.bulk_lookup.routers import bulk_ioc_lookup_routes
from app.features.ioc_tools.ioc_lookup.single_lookup.routers import single_ioc_lookup_routes

from app.features.newsfeed.routers import external_newsfeed_routes, internal_newsfeed_routes
from app.features.newsfeed.service import newsfeed_service
from app.features.newsfeed.models import newsfeed_models
from app.features.newsfeed.schemas import newsfeed_schemas

from app.core.settings.general.models.general_settings_models import Settings
from app.core.settings.modules.models.modules_settings_models import ModuleSettings


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('data/app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")


# Create database tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Failed to create database tables: {str(e)}")
    raise


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
    title=fastapi_config.APP_TITLE,
    description=fastapi_config.DESCRIPTION,
    version=fastapi_config.APP_VERSION,
    contact=fastapi_config.CONTACT_INFO,
    license_info=fastapi_config.LICENSE_INFO,
    openapi_tags=fastapi_config.TAGS_METADATA,
    swagger_ui_parameters=fastapi_config.SWAGGER_UI_PARAMETERS,
    lifespan=lifespan 
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router includes
routers = [
    healthcheck.router,
    internal_llm_templates_routes.router,
    external_domain_lookup_routes.router,
    internal_email_analyzer_routes.router,
    internal_ioc_extractor_routes.router,
    internal_defang_routes.router,
    #alerts_routes.router,
    internal_newsfeed_routes.router,
    external_newsfeed_routes.router,
    api_keys_settings_routes.router,
    service_config_routes.router,
    general_settings_routes.router,
    modules_settings_routes.router,
    keywords_settings_routes.router,
    cti_profile_settings_routes.router,
    bulk_ioc_lookup_routes.router,
    single_ioc_lookup_routes.router
]

for router in routers:
    app.include_router(router)




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
        ("IOC Tools", True),
        ("Email Analyzer", True),
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
    from app.features.newsfeed.utils.default_rss_feeds import DEFAULT_NEWSFEEDS
    
    try:
        for feed_data in DEFAULT_NEWSFEEDS:
            existing_feed = db.query(newsfeed_models.NewsfeedSettings).filter(
                newsfeed_models.NewsfeedSettings.name == feed_data["name"]).first()
            if not existing_feed:
                db.add(newsfeed_models.NewsfeedSettings(
                    name=feed_data["name"],
                    url=feed_data["url"],
                    icon=feed_data["icon"],
                    enabled=feed_data["enabled"]
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
        # Check if templates already exist
        existing_templates = db.query(AITemplate).first()
        if not existing_templates:
            logger.info("No existing templates found. Seeding default templates...")
            
            for template_data in default_llm_templates.DEFAULT_TEMPLATES:
                # Make a copy to avoid modifying the original
                template = dict(template_data)
                
                # Convert dictionaries to JSON strings for SQLite
                if "payload_fields" in template:
                    if not isinstance(template["payload_fields"], str):
                        template["payload_fields"] = json.dumps(template["payload_fields"])
                
                if "static_contexts" in template:
                    if not isinstance(template["static_contexts"], str):
                        template["static_contexts"] = json.dumps(template["static_contexts"])
                
                if "web_contexts" in template:
                    if not isinstance(template["web_contexts"], str):
                        template["web_contexts"] = json.dumps(template["web_contexts"])
                
                # Create model instance directly
                new_template = AITemplate(**template)
                db.add(new_template)
            
            # Commit all template insertions at once
            db.commit()
            logger.info("Default templates seeded successfully")
        else:
            logger.info("Templates already exist, skipping seed")
    except Exception as e:
        logger.error(f"Failed to seed default templates: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to seed default templates: {str(e)}")

async def initialize_defaults(db: Session) -> None:
    """Initialize all default settings concurrently."""
    try:
        await asyncio.gather(
            add_default_general_settings(db),
            add_default_module_settings(db),
            add_default_newsfeeds(db),
            seed_default_llm_templates(db),
            add_default_api_keys(db)
        )
    except Exception as e:
        logger.error(f"Failed to initialize defaults: {str(e)}")
        raise
