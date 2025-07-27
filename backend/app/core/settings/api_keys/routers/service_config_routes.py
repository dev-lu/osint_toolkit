from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import Dict, List, Optional, Any
from app.core.dependencies import get_db
from app.core.settings.api_keys.config.service_config import (
    SERVICE_DEFINITIONS,
    ServiceDefinition,
    ServiceCategory,
    ServiceTier,
    get_service_definition,
    get_all_service_definitions,
    get_services_by_category,
    get_services_by_tier,
    get_services_for_ioc_type,
    get_required_keys_for_service
)
from app.core.settings.api_keys.crud.api_keys_settings_crud import get_apikeys
from app.core.settings.api_keys.config.create_defaults import (
    get_service_status_summary
)

import logging

router = APIRouter()

@router.get("/api/services/config", response_model=Dict[str, Dict[str, Any]], tags=["Service Configuration"])
def get_services_config(
    category: Optional[ServiceCategory] = Query(None, description="Filter by service category"),
    tier: Optional[ServiceTier] = Query(None, description="Filter by service tier"),
    ioc_type: Optional[str] = Query(None, description="Filter by supported IOC type"),
    db: Session = Depends(get_db)
):
    """
    Get service configuration data.
    
    - **category**: Filter by service category (threat_intelligence, security_scanning, etc.)
    - **tier**: Filter by service tier (free, paid, freemium)
    - **ioc_type**: Filter by supported IOC type (IPv4, Domain, Email, etc.)
    """
    try:
        services = get_all_service_definitions()
        
        # Apply filters
        if category:
            services = get_services_by_category(category)
        if tier:
            services = get_services_by_tier(tier)
        if ioc_type:
            services = get_services_for_ioc_type(ioc_type)
        
        # Get current API key states
        api_keys = get_apikeys(db)
        api_key_states = {apikey.name: apikey.is_active for apikey in api_keys}
        
        # Convert to response format and add API key status
        response = {}
        for key, service in services.items():
            service_dict = service.to_dict()
            
            # Add API key status information
            service_dict["api_key_status"] = {}
            for required_key in service.required_keys:
                service_dict["api_key_status"][required_key] = {
                    "configured": required_key in api_key_states,
                    "active": api_key_states.get(required_key, False)
                }
            
            # Calculate overall service availability
            if not service.required_keys:
                service_dict["available"] = True
            else:
                service_dict["available"] = all(
                    api_key_states.get(key, False) for key in service.required_keys
                )
            
            response[key] = service_dict
        
        logging.info(f"Retrieved {len(response)} service configurations")
        return response
        
    except Exception as e:
        logging.error(f"Error retrieving service configuration: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve service configuration")

@router.get("/api/services/config/{service_key}", response_model=Dict[str, Any], tags=["Service Configuration"])
def get_service_config(service_key: str, db: Session = Depends(get_db)):
    """
    Get configuration for a specific service.
    
    - **service_key**: The unique identifier for the service
    """
    try:
        service = get_service_definition(service_key)
        if not service:
            raise HTTPException(status_code=404, detail=f"Service '{service_key}' not found")
        
        api_keys = get_apikeys(db)
        api_key_states = {apikey.name: apikey.is_active for apikey in api_keys}
        
        service_dict = service.to_dict()
        service_dict["api_key_status"] = {}
        
        for required_key in service.required_keys:
            service_dict["api_key_status"][required_key] = {
                "configured": required_key in api_key_states,
                "active": api_key_states.get(required_key, False)
            }
        
        if not service.required_keys: 
            service_dict["available"] = True
        else:
            service_dict["available"] = all(
                api_key_states.get(key, False) for key in service.required_keys
            )
        
        logging.info(f"Retrieved configuration for service: {service_key}")
        return service_dict
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error retrieving service configuration for {service_key}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve service configuration")

@router.get("/api/services/categories", response_model=List[str], tags=["Service Configuration"])
def get_service_categories():
    """Get all available service categories."""
    try:
        categories = [category.value for category in ServiceCategory]
        logging.info(f"Retrieved {len(categories)} service categories")
        return categories
    except Exception as e:
        logging.error(f"Error retrieving service categories: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve service categories")

@router.get("/api/services/tiers", response_model=List[str], tags=["Service Configuration"])
def get_service_tiers():
    """Get all available service tiers."""
    try:
        tiers = [tier.value for tier in ServiceTier]
        logging.info(f"Retrieved {len(tiers)} service tiers")
        return tiers
    except Exception as e:
        logging.error(f"Error retrieving service tiers: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve service tiers")

@router.get("/api/services/ioc-types", response_model=List[str], tags=["Service Configuration"])
def get_supported_ioc_types():
    """Get all supported IOC types across all services."""
    try:
        ioc_types = set()
        for service in get_all_service_definitions().values():
            ioc_types.update(service.supported_ioc_types)
        
        ioc_types_list = sorted(list(ioc_types))
        logging.info(f"Retrieved {len(ioc_types_list)} supported IOC types")
        return ioc_types_list
    except Exception as e:
        logging.error(f"Error retrieving supported IOC types: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve supported IOC types")

@router.get("/api/services/for-ioc/{ioc_type}", response_model=Dict[str, Dict[str, Any]], tags=["Service Configuration"])
def get_services_for_ioc(ioc_type: str, db: Session = Depends(get_db)):
    """
    Get all services that support a specific IOC type.
    
    - **ioc_type**: The IOC type to filter by (IPv4, Domain, Email, etc.)
    """
    try:
        services = get_services_for_ioc_type(ioc_type)
        if not services:
            return {}
        
        api_keys = get_apikeys(db)
        api_key_states = {apikey.name: apikey.is_active for apikey in api_keys}
        
        response = {}
        for key, service in services.items():
            service_dict = service.to_dict()
            service_dict["api_key_status"] = {}
            
            for required_key in service.required_keys:
                service_dict["api_key_status"][required_key] = {
                    "configured": required_key in api_key_states,
                    "active": api_key_states.get(required_key, False)
                }
            
            if not service.required_keys:
                service_dict["available"] = True
            else:
                service_dict["available"] = all(
                    api_key_states.get(key, False) for key in service.required_keys
                )
            
            response[key] = service_dict
        
        logging.info(f"Retrieved {len(response)} services for IOC type: {ioc_type}")
        return response
        
    except Exception as e:
        logging.error(f"Error retrieving services for IOC type {ioc_type}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve services for IOC type")