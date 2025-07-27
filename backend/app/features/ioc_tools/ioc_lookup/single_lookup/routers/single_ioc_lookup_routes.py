import logging
from fastapi import APIRouter, Query, Depends, HTTPException
from typing import Optional
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.features.ioc_tools.ioc_lookup.single_lookup.service.ioc_lookup_engine import (
    lookup_ioc, get_all_service_configs
)
from app.features.ioc_tools.ioc_lookup.single_lookup.utils.ioc_utils import determine_ioc_type, IOC_TYPES
from app.features.ioc_tools.ioc_lookup.single_lookup.service.service_registry import get_all_services

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/api/ioc/lookup/{service}", tags=["IOC Lookup"])
async def unified_lookup(
    service: str,
    ioc: str = Query(..., description="The IOC value to lookup"),
    ioc_type: Optional[str] = Query(None, description="The IOC type (e.g., IPv4, Domain, MD5)"),
    db: Session = Depends(get_db)
):
    """
    Unified endpoint for all single IOC lookups.

    Args:
        service: The unique key for the service (e.g., 'virustotal', 'abuseipdb')
        ioc: The indicator value to lookup
        ioc_type: Optional IOC type. If not provided, it will be auto-detected
        db: Database session dependency

    Returns:
        Dictionary containing lookup results or error information

    Raises:
        HTTPException: For invalid IOC formats
    """
    logger.info(f"Received lookup request for service={service}, ioc={ioc[:20]}...")
    
    detected_ioc_type = ioc_type or determine_ioc_type(ioc)
    if detected_ioc_type == IOC_TYPES['UNKNOWN']:
        logger.warning(f"Invalid IOC format: {ioc}")
        raise HTTPException(
            status_code=400,
            detail=f"Invalid or unsupported IOC format for: {ioc}"
        )

    result = lookup_ioc(service, ioc, detected_ioc_type, db)
    logger.info(f"Completed lookup for service={service}")
    return result


@router.get("/api/ioc/services", tags=["IOC Lookup"])
async def get_available_services(
    ioc_type: Optional[str] = Query(None, description="Filter services by IOC type"),
    db: Session = Depends(get_db)
):
    """
    Get a list of all available services with their configuration and status.

    Args:
        ioc_type: Optional IOC type filter
        db: Database session dependency

    Returns:
        Dictionary containing list of available services
    """
    logger.debug(f"Retrieving available services, filter={ioc_type}")
    
    all_services = get_all_service_configs(db)

    if not ioc_type:
        logger.debug(f"Returning {len(all_services)} services")
        return {"services": all_services}

    filtered_services = [
        s for s in all_services
        if ioc_type in s.get('supported_ioc_types', [])
    ]
    
    logger.debug(f"Returning {len(filtered_services)} filtered services")
    return {"services": filtered_services}


@router.get("/api/ioc/types", tags=["IOC Lookup"])
async def get_supported_ioc_types():
    """
    Get the dictionary of supported IOC types.

    Returns:
        Dictionary containing all supported IOC types
    """
    logger.debug("Retrieving supported IOC types")
    return {"types": IOC_TYPES}


@router.get("/api/ioc/service-definitions", tags=["IOC Lookup"])
async def get_service_definitions(db: Session = Depends(get_db)):
    """
    Get complete service definitions including configuration and availability.

    Args:
        db: Database session dependency

    Returns:
        Dictionary containing service definitions with availability status
    """
    logger.debug("Retrieving service definitions")
    
    from app.core.settings.api_keys.crud.api_keys_settings_crud import get_apikeys
    
    all_apikeys = get_apikeys(db)
    api_key_map = {key.name: key.key for key in all_apikeys if key.name and key.key}
    
    service_definitions = {}
    all_services = get_all_services()
    
    for service_name, config in all_services.items():
        required_keys = _get_required_keys(config)
        is_available = _check_service_availability(config, required_keys, api_key_map)
        
        service_definitions[service_name] = {
            'name': config['name'],
            'requiredKeys': required_keys,
            'supportedIocTypes': config.get('supported_ioc_types', []),
            'isAvailable': is_available,
            'icon': f"{service_name}_logo_small",
        }
    
    logger.debug(f"Retrieved {len(service_definitions)} service definitions")
    return {"serviceDefinitions": service_definitions}


def _get_required_keys(config: dict) -> list:
    """
    Extract required API keys from service configuration.
    
    Args:
        config: Service configuration dictionary
        
    Returns:
        List of required API key names
    """
    if config.get('api_key_name'):
        return [config['api_key_name']]
    elif config.get('api_key_names'):
        return config['api_key_names']
    return []


def _check_service_availability(config: dict, required_keys: list, api_key_map: dict) -> bool:
    """
    Check if a service is available based on API key requirements.
    
    Args:
        config: Service configuration dictionary
        required_keys: List of required API key names
        api_key_map: Dictionary mapping key names to values
        
    Returns:
        True if service is available, False otherwise
    """
    if config.get('api_key_name') is None and not config.get('api_key_names'):
        return True
    
    if required_keys:
        return all(
            key_name in api_key_map and api_key_map[key_name].strip() 
            for key_name in required_keys
        )
    
    return True
