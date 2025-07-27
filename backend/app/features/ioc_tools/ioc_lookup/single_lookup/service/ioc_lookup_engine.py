import logging
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from app.core.settings.api_keys.crud.api_keys_settings_crud import get_apikey
from .service_registry import service_registry
from app.features.ioc_tools.ioc_lookup.single_lookup.service import external_api_clients as service_functions

logger = logging.getLogger(__name__)


def lookup_ioc(service_name: str, ioc: str, ioc_type: str, db: Session, **kwargs) -> Dict[str, Any]:
    """
    Perform a unified IOC lookup by dispatching to the appropriate service function.
    
    Args:
        service_name: The unique identifier for the lookup service
        ioc: The indicator of compromise value to lookup
        ioc_type: The type of IOC (e.g., 'ipv4', 'domain', 'hash')
        db: Database session for API key retrieval
        **kwargs: Additional arguments passed to the service function
        
    Returns:
        Dict containing the lookup result or error information
        
    Raises:
        None - All exceptions are caught and returned as error dictionaries
    """
    logger.info(f"Starting IOC lookup for service={service_name}, ioc_type={ioc_type}")
    
    service_config = service_registry.get_service(service_name)
    if not service_config:
        logger.warning(f"Service not found: {service_name}")
        return {"error": 404, "message": f"Service '{service_name}' not found."}

    if ioc_type not in service_config.get('supported_ioc_types', []):
        logger.warning(f"Unsupported IOC type {ioc_type} for service {service_name}")
        return {
            "error": 400,
            "message": f"Service '{service_name}' does not support IOC type '{ioc_type}'.",
            "supported_types": service_config.get('supported_ioc_types', [])
        }

    api_keys = _get_api_keys(service_config, db)
    if api_keys is None and _requires_api_key(service_config):
        logger.error(f"Missing API keys for service: {service_name}")
        return {"error": 401, "message": f"Required API key(s) for '{service_name}' are missing or inactive."}

    func_args = _prepare_function_args(service_config, ioc, ioc_type, api_keys, **kwargs)

    try:
        logger.debug(f"Calling {service_name} lookup function with args: {list(func_args.keys())}")
        result = service_config['func'](**func_args)
        logger.info(f"Successfully completed lookup for {service_name}")
        return result
    except Exception as e:
        logger.error(f"Critical error in {service_name} lookup: {str(e)}", exc_info=True)
        return {"error": 500, "message": f"An unexpected error occurred in service '{service_name}'."}


def _get_api_keys(service_config: Dict[str, Any], db: Session) -> Optional[Dict[str, str]]:
    """
    Retrieve required API keys for a service from the database.
    
    Args:
        service_config: Service configuration dictionary
        db: Database session
        
    Returns:
        Dictionary of API keys or None if required keys are missing
    """
    key_names = service_config.get('api_key_names') or (
        [service_config['api_key_name']] if service_config.get('api_key_name') else []
    )
    
    if not key_names:
        return {}

    keys = {}
    for key_name in key_names:
        key_data = get_apikey(name=key_name, db=db)
        if not key_data or not key_data.get('is_active'):
            logger.warning(f"Missing or inactive API key: {key_name}")
            return None
        keys[key_name] = key_data.get('key')
    
    return keys


def _requires_api_key(service_config: Dict[str, Any]) -> bool:
    """
    Check if a service configuration requires one or more API keys.
    
    Args:
        service_config: Service configuration dictionary
        
    Returns:
        True if API keys are required, False otherwise
    """
    return bool(service_config.get('api_key_name') or service_config.get('api_key_names'))


def _prepare_function_args(
    service_config: Dict[str, Any], 
    ioc: str, 
    ioc_type: str, 
    api_keys: Dict[str, str], 
    **kwargs
) -> Dict[str, Any]:
    """
    Prepare the arguments dictionary for the specific service function call.
    
    Args:
        service_config: Service configuration dictionary
        ioc: The IOC value to lookup
        ioc_type: The IOC type
        api_keys: Dictionary of API keys
        **kwargs: Additional arguments
        
    Returns:
        Dictionary of prepared function arguments
    """
    args = {'ioc': ioc.strip()}

    if service_config.get('requires_type'):
        type_param = service_config.get('ioc_type_param', 'type')
        type_map = service_config.get('type_map', {})
        param_value = type_map.get(ioc_type, ioc_type.lower())
        args[type_param] = param_value
    
    if _requires_api_key(service_config):
        if 'api_key_params' in service_config:
            for param, key_name in service_config['api_key_params'].items():
                args[param] = api_keys.get(key_name)
        elif 'api_key_name' in service_config and api_keys:
            args['apikey'] = next(iter(api_keys.values()))
    
    args.update(kwargs)
    return args


def get_all_service_configs(db: Session) -> List[Dict[str, Any]]:
    """
    Get configuration for all services with their availability status.
    
    Args:
        db: Database session
        
    Returns:
        List of service configurations with status information
    """
    logger.debug("Retrieving all service configurations")
    
    services_with_status = []
    for service_key, config in service_registry.services.items():
        is_configured = (
            _get_api_keys(config, db) is not None 
            if _requires_api_key(config) 
            else True
        )
        
        is_bulk_enabled = _check_bulk_lookup_enabled(config, db)

        services_with_status.append({
            'key': service_key,
            'name': config.get('name', service_key),
            'supported_ioc_types': config.get('supported_ioc_types', []),
            'is_configured': is_configured,
            'is_bulk_enabled': is_bulk_enabled,
        })
    
    logger.debug(f"Retrieved {len(services_with_status)} service configurations")
    return services_with_status


def _check_bulk_lookup_enabled(service_config: Dict[str, Any], db: Session) -> bool:
    """
    Check if bulk lookup is enabled for a service.
    
    Args:
        service_config: Service configuration dictionary
        db: Database session
        
    Returns:
        True if bulk lookup is enabled, False otherwise
    """
    key_names = service_config.get('api_key_names') or (
        [service_config['api_key_name']] if service_config.get('api_key_name') else []
    )
    
    if not key_names:
        return True

    bulk_statuses = []
    for key_name in key_names:
        key_data = get_apikey(name=key_name, db=db)
        if key_data and key_data.get('is_active'):
            bulk_statuses.append(key_data.get('bulk_ioc_lookup', False))
    
    return all(bulk_statuses) and len(bulk_statuses) > 0


def initialize_service_registry():
    """
    Initialize the service registry with all available services.
    
    This function should be called once during application startup.
    """
    if not service_registry.services:
        logger.info("Initializing service registry")
        service_registry.register_services(service_functions)
        logger.info(f"Registered {len(service_registry.services)} services")


# Initialize the service registry on module import
initialize_service_registry()
