import asyncio
import json
import logging
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from app.core.dependencies import get_db
from app.features.ioc_tools.ioc_lookup.bulk_lookup.service.bulk_ioc_lookup_service import (
    process_bulk_lookups
)

logger = logging.getLogger(__name__)
router = APIRouter()


class BulkLookupRequest(BaseModel):
    """Request model for bulk IOC lookups."""
    iocs: List[str]
    services: List[str]


@router.post("/api/ioc-lookup/bulk", tags=["IOC Lookup"])
async def bulk_ioc_lookup(
    request: BulkLookupRequest, 
    db: Session = Depends(get_db)
):
    """
    Perform bulk IOC lookups across multiple services with streaming results.
    
    Args:
        request: Bulk lookup request containing IOCs and services
        db: Database session dependency
        
    Returns:
        StreamingResponse with Server-Sent Events containing results
        
    Raises:
        HTTPException: For invalid requests
    """
    logger.info(f"Starting bulk lookup for {len(request.iocs)} IOCs across {len(request.services)} services")
    
    if not request.iocs:
        raise HTTPException(status_code=400, detail="No IOCs provided")
    
    if not request.services:
        raise HTTPException(status_code=400, detail="No services specified")

    async def event_stream():
        """Generate Server-Sent Events stream for bulk lookup results."""
        try:
            async for result in process_bulk_lookups(
                request.iocs, 
                request.services, 
                db
            ):
                data = json.dumps(result)
                yield f"data: {data}\n\n"
                
        except Exception as e:
            logger.error(f"Error in bulk lookup stream: {str(e)}", exc_info=True)
            error_data = json.dumps({"error": str(e), "service": "system"})
            yield f"data: {error_data}\n\n"
    
    return StreamingResponse(
        event_stream(), 
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@router.get("/api/apikeys/bulk_ioc_lookup", tags=["IOC Lookup"])
async def get_bulk_lookup_settings(db: Session = Depends(get_db)):
    """
    Get the bulk lookup settings for all services.
    
    Args:
        db: Database session dependency
        
    Returns:
        Dictionary mapping service names to their bulk lookup status
    """
    logger.debug("Retrieving bulk lookup settings")
    
    from app.core.settings.api_keys.crud.api_keys_settings_crud import get_apikeys
    from app.features.ioc_tools.ioc_lookup.single_lookup.service.service_registry import get_all_services
    
    all_apikeys = get_apikeys(db)
    bulk_status_map = {}
    
    for key in all_apikeys:
        if key.name and hasattr(key, 'bulk_ioc_lookup'):
            bulk_status_map[key.name] = key.bulk_ioc_lookup
    
    all_services = get_all_services()
    for service_name, config in all_services.items():
        if not config.get('api_key_name') and not config.get('api_key_names'):
            bulk_status_map[service_name] = True
    
    logger.debug(f"Retrieved bulk settings for {len(bulk_status_map)} services")
    return bulk_status_map


@router.put("/api/apikeys/{key_name}/bulk_ioc_lookup", tags=["IOC Lookup"])
async def update_bulk_lookup_setting(
    key_name: str,
    bulk_ioc_lookup: bool,
    db: Session = Depends(get_db)
):
    """
    Update bulk lookup setting for a specific API key or service.
    
    Args:
        key_name: Name of the API key or service
        bulk_ioc_lookup: New bulk lookup setting value
        db: Database session dependency
        
    Returns:
        Dictionary containing success status and message
        
    Raises:
        HTTPException: For invalid key names or update failures
    """
    logger.info(f"Updating bulk lookup setting for {key_name} to {bulk_ioc_lookup}")
    
    from app.core.settings.api_keys.crud.api_keys_settings_crud import update_apikey, create_apikey
    from app.features.ioc_tools.ioc_lookup.single_lookup.service.service_registry import get_service
    
    try:
        result = update_apikey(
            db=db,
            name=key_name,
            bulk_ioc_lookup=bulk_ioc_lookup
        )
        
        if result:
            logger.info(f"Successfully updated bulk lookup setting for {key_name}")
            return {"success": True, "message": f"Updated bulk lookup setting for {key_name}"}
        
        service_config = get_service(key_name)
        if service_config and not service_config.get('api_key_name') and not service_config.get('api_key_names'):
            try:
                create_result = create_apikey(
                    db=db,
                    name=key_name,
                    value="",
                    bulk_ioc_lookup=bulk_ioc_lookup
                )
                if create_result:
                    logger.info(f"Created bulk lookup setting for keyless service {key_name}")
                    return {"success": True, "message": f"Updated bulk lookup setting for keyless service {key_name}"}
            except Exception as e:
                logger.warning(f"Failed to create setting for {key_name}, trying update: {str(e)}")
                result = update_apikey(
                    db=db,
                    name=key_name,
                    bulk_ioc_lookup=bulk_ioc_lookup
                )
                if result:
                    return {"success": True, "message": f"Updated bulk lookup setting for {key_name}"}
        
        logger.error(f"Failed to update bulk lookup setting for {key_name}")
        raise HTTPException(
            status_code=404, 
            detail=f"API key or service '{key_name}' not found"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating bulk lookup setting for {key_name}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal error updating setting for {key_name}"
        )
