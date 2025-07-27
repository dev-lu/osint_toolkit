import asyncio
import logging
from typing import Dict, Any, List, AsyncGenerator
from sqlalchemy.orm import Session
from app.features.ioc_tools.ioc_lookup.single_lookup.service.ioc_lookup_engine import (
    lookup_ioc, get_all_service_configs
)
from app.features.ioc_tools.ioc_lookup.single_lookup.service.service_registry import service_registry

logger = logging.getLogger(__name__)


async def run_single_lookup(
    service_name: str, 
    ioc: str, 
    ioc_type: str, 
    db: Session
) -> Dict[str, Any]:
    """
    Execute a single IOC lookup asynchronously.
    
    Args:
        service_name: The service to query
        ioc: The IOC value to lookup
        ioc_type: The type of IOC
        db: Database session
        
    Returns:
        Dictionary containing lookup result or error information
    """
    try:
        service_config = service_registry.get_service(service_name)
        if not service_config:
            logger.warning(f"Service not configured: {service_name}")
            return {"error": f"Service '{service_name}' not configured"}
        
        if ioc_type not in service_config.get('supported_ioc_types', []):
            logger.debug(f"Service {service_name} doesn't support IOC type {ioc_type}")
            return {"error": f"Service '{service_name}' doesn't support {ioc_type}"}
        
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: lookup_ioc(service_name, ioc, ioc_type, db)
        )
        
        logger.debug(f"Completed lookup for {service_name}: {ioc}")
        return result
        
    except Exception as e:
        logger.error(f"Exception in {service_name} lookup for {ioc}: {str(e)}", exc_info=True)
        return {"error": f"Exception in {service_name} lookup: {str(e)}"}


async def process_bulk_lookups(
    iocs: List[str],
    services: List[str],
    db: Session
) -> AsyncGenerator[Dict[str, Any], None]:
    """
    Process bulk IOC lookups and yield results as they complete.
    
    Args:
        iocs: List of IOC values to lookup
        services: List of service names to query
        db: Database session
        
    Yields:
        Dictionary containing individual lookup results or errors
    """
    logger.info(f"Starting bulk lookup for {len(iocs)} IOCs across {len(services)} services")
    
    from app.features.ioc_tools.ioc_lookup.single_lookup.utils.ioc_utils import determine_ioc_type
    
    all_service_configs = get_all_service_configs(db)
    
    enabled_and_requested_services = {
        s['key'] for s in all_service_configs
        if s['key'] in services and s['is_configured'] and s['is_bulk_enabled']
    }
    
    services_to_query = list(enabled_and_requested_services)
    
    if not services_to_query:
        logger.warning("No services available for bulk lookup")
        yield {
            "error": "No selected services are available or enabled for bulk lookup.",
            "service": "system",
            "available_services": [s['key'] for s in all_service_configs if s['is_configured']]
        }
        return
    
    logger.info(f"Using services: {services_to_query}")
    
    tasks = []
    for ioc_value in iocs:
        ioc_type = determine_ioc_type(ioc_value)
        if ioc_type == "unknown":
            logger.warning(f"Unknown IOC type for: {ioc_value}")
            yield {
                "ioc": ioc_value,
                "service": "system",
                "error": "Unknown IOC type"
            }
            continue
        
        for service_name in services_to_query:
            coro = run_single_lookup(service_name, ioc_value, ioc_type, db)
            task = asyncio.create_task(coro)
            tasks.append((ioc_value, service_name, task))
    
    logger.info(f"Created {len(tasks)} lookup tasks")
    
    for ioc_value, service_name, task in tasks:
        try:
            result = await task
            if isinstance(result, dict) and 'error' in result:
                yield {
                    "ioc": ioc_value, 
                    "service": service_name, 
                    "error": result.get("message", "Service error")
                }
            else:
                yield {
                    "ioc": ioc_value, 
                    "service": service_name, 
                    "data": result
                }
        except Exception as e:
            logger.error(f"Error awaiting task for {ioc_value}/{service_name}: {str(e)}")
            yield {
                "ioc": ioc_value,
                "service": service_name,
                "error": str(e)
            }
    
    logger.info("Completed bulk lookup processing")
