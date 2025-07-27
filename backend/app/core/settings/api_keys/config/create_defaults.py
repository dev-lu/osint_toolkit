from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.core.settings.api_keys.config.service_config import get_all_service_definitions
from app.core.settings.api_keys.models.api_keys_settings_models import Apikey
import logging

async def add_default_api_keys(db: Session) -> None:
    """Add default API key entries for all services if they don't exist."""
    services = get_all_service_definitions()
    
    try:
        for service_key, service_config in services.items():
            if service_config.required_keys:
                for required_key in service_config.required_keys:
                    existing_key = db.query(Apikey).filter(Apikey.name == required_key).first()
                    
                    if not existing_key:
                        db.add(Apikey(
                            name=required_key,
                            key=None, 
                            is_active=False, 
                            bulk_ioc_lookup=False
                        ))
                        logging.debug(f"Created API key entry: {required_key}")
            else:
                existing_key = db.query(Apikey).filter(Apikey.name == service_key).first()
                
                if not existing_key:
                    db.add(Apikey(
                        name=service_key,
                        key="",
                        is_active=True,
                        bulk_ioc_lookup=False 
                    ))
                    logging.debug(f"Created free service entry: {service_key}")
        
        db.commit()
        logging.info('Default API keys checked/created')
        
    except SQLAlchemyError as e:
        logging.error(f'Failed to add default API keys: {str(e)}')
        db.rollback()
        raise

def get_service_status_summary(db: Session) -> dict:
    """
    Get a summary of service configuration status.
    """
    services = get_all_service_definitions()
    existing_keys = db.query(Apikey).all()
    key_status = {key.name: {'configured': bool(key.key and key.key.strip()), 'active': key.is_active} for key in existing_keys}
    
    summary = {
        'total_services': len(services),
        'services_with_keys': 0,
        'fully_configured_services': 0,
        'active_services': 0,
        'services': {}
    }
    
    for service_key, service_config in services.items():
        service_status = {
            'name': service_config.name,
            'required_keys': service_config.required_keys,
            'keys_configured': 0,
            'keys_active': 0,
            'fully_configured': False,
            'fully_active': False
        }
        
        if not service_config.required_keys:
            service_status['fully_configured'] = True
            service_status['fully_active'] = True
            summary['services_with_keys'] += 1
            summary['fully_configured_services'] += 1
            summary['active_services'] += 1
        else:
            for required_key in service_config.required_keys:
                if required_key in key_status:
                    if key_status[required_key]['configured']:
                        service_status['keys_configured'] += 1
                    if key_status[required_key]['active']:
                        service_status['keys_active'] += 1
            
            total_required = len(service_config.required_keys)
            service_status['fully_configured'] = service_status['keys_configured'] == total_required
            service_status['fully_active'] = service_status['keys_active'] == total_required
            
            if service_status['keys_configured'] > 0:
                summary['services_with_keys'] += 1
            if service_status['fully_configured']:
                summary['fully_configured_services'] += 1
            if service_status['fully_active']:
                summary['active_services'] += 1
        
        summary['services'][service_key] = service_status
    
    return summary