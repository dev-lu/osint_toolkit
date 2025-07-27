from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.core.settings.api_keys.crud.api_keys_settings_crud import get_apikey, get_apikeys, delete_existing_apikey, create_new_apikey
from app.core.settings.api_keys.schemas.api_keys_settings_schemas import ApikeySchema, ApikeyStateResponse, DeleteApikeyResponse, ApikeyBulkLookupStateResponse
from app.core.settings.api_keys.models.api_keys_settings_models import Apikey
import logging
from typing import Dict, Any, List


router = APIRouter()

# Create API key
@router.post("/api/apikeys/", response_model=ApikeySchema, tags=["Settings"], status_code=status.HTTP_201_CREATED)
def create_apikey(apikey: ApikeySchema, db: Session = Depends(get_db)):
    """
    Create a new API key.
    - **name**: Name of the API key provider (e.g., "VirusTotal").
    - **key**: The API key string.
    - **is_active**: Set to true to enable the key for lookups.
    - **bulk_ioc_lookup**: Set to true to enable the key for bulk lookups.
    """
    existing_apikey = get_apikey(db, apikey.name)
    if existing_apikey['name'] == "None":
        db_apikey = create_new_apikey(db, apikey)
        logging.debug(f"Added API key: {apikey.name}")
        return db_apikey.to_dict()
    logging.error(f"Could not add API key. API key already exists: {apikey.name}")
    raise HTTPException(status_code=409, detail="Apikey already exists")


# Delete API key by name
@router.delete("/api/apikeys", response_model=DeleteApikeyResponse, tags=["Settings"])
def delete_apikey(name: str, db: Session = Depends(get_db)):
    """Delete an API key by its name."""
    apikey = get_apikey(db, name)
    if apikey['name'] == "None":
        logging.error("Could not delete API key: API key not found")
        raise HTTPException(status_code=404, detail="API key not found")
    delete_existing_apikey(db=db, name=name)
    logging.info(f"Deleted API key: {name}")
    return DeleteApikeyResponse(apikey=ApikeySchema(**apikey), message="API key deleted successfully")


# Get all API keys 
"""
@router.get("/api/apikeys/", response_model=list[ApikeySchema], tags=["Settings"])
def read_apikeys(db: Session = Depends(get_db)):
    apikeys = get_apikeys(db)
    if not apikeys:
        logging.error("Could not get API keys: No API keys found")
        raise HTTPException(status_code=404, detail="No API keys found")
    return [apikey.to_dict() for apikey in apikeys]
"""

# Get API key by name 
"""
@router.get("/api/apikeys", response_model=ApikeySchema, tags=["Settings"])
def read_apikey(name: str, db: Session = Depends(get_db)):
    apikey = get_apikey(db, name)
    if apikey['name'] == "None":
        logging.error(f"Could not get API key. API key not found: {name}")
        raise HTTPException(status_code=404, detail="Apikey not found")
    return apikey
"""

# Get all API keys 'is_active' state
@router.get("/api/apikeys/is_active", response_model=Dict[str, bool], tags=["Settings"])
def get_all_apikeys_is_active(db: Session = Depends(get_db)):
    """Get the 'is_active' status for all API keys."""
    apikeys = get_apikeys(db)
    return {apikey.name: apikey.is_active for apikey in apikeys}

# Get specific API key 'is_active' state
@router.get("/api/apikeys/{name}/is_active", response_model=bool, tags=["Settings"])
def get_apikey_is_active(name: str, db: Session = Depends(get_db)):
    """Get the 'is_active' status for a specific API key."""
    apikey_data = get_apikey(db, name)
    if apikey_data['name'] == 'None':
        raise HTTPException(status_code=404, detail="Apikey not found")
    return apikey_data['is_active']

# Change API key 'is_active' state
@router.put("/api/apikeys/{name}/is_active", response_model=ApikeySchema, tags=["Settings"])
def update_apikey_is_active(name: str, is_active: bool, db: Session = Depends(get_db)):
    """Update the 'is_active' status for a specific API key."""
    db_apikey = db.query(Apikey).filter(Apikey.name == name).first()
    if not db_apikey:
        raise HTTPException(status_code=404, detail="Apikey not found")
    db_apikey.is_active = is_active
    db.commit()
    db.refresh(db_apikey)
    return db_apikey.to_dict()

# Get all API keys 'bulk_ioc_lookup' state
@router.get("/api/apikeys/bulk_ioc_lookup", response_model=Dict[str, bool], tags=["Settings"])
def get_all_apikeys_bulk_lookup(db: Session = Depends(get_db)):
    """Get the 'bulk_ioc_lookup' status for all API keys."""
    apikeys = get_apikeys(db)
    return {apikey.name: apikey.bulk_ioc_lookup for apikey in apikeys}

# Get specific API key 'bulk_ioc_lookup' state
@router.get("/api/apikeys/{name}/bulk_ioc_lookup", response_model=bool, tags=["Settings"])
def get_apikey_bulk_lookup(name: str, db: Session = Depends(get_db)):
    """Get the 'bulk_ioc_lookup' status for a specific API key."""
    apikey_data = get_apikey(db, name)
    if apikey_data['name'] == 'None':
        raise HTTPException(status_code=404, detail="Apikey not found")
    return apikey_data['bulk_ioc_lookup']

# Change API key 'bulk_ioc_lookup' state
@router.put("/api/apikeys/{name}/bulk_ioc_lookup", response_model=ApikeySchema, tags=["Settings"])
def update_apikey_bulk_lookup(name: str, bulk_ioc_lookup: bool, db: Session = Depends(get_db)):
    """Update the 'bulk_ioc_lookup' status for a specific API key."""
    db_apikey = db.query(Apikey).filter(Apikey.name == name).first()
    if not db_apikey:
        raise HTTPException(status_code=404, detail="Apikey not found")
    db_apikey.bulk_ioc_lookup = bulk_ioc_lookup
    db.commit()
    db.refresh(db_apikey)
    return db_apikey.to_dict()

# Update API key (for clearing keys instead of deleting entries)
@router.put("/api/apikeys/{name}", response_model=ApikeySchema, tags=["Settings"])
def update_apikey(name: str, apikey: ApikeySchema, db: Session = Depends(get_db)):
    """
    Update an existing API key.
    - **name**: Name of the API key provider.
    - **apikey**: Updated API key data.
    """
    db_apikey = db.query(Apikey).filter(Apikey.name == name).first()
    if not db_apikey:
        raise HTTPException(status_code=404, detail="API key not found")
    
    # Update the fields
    db_apikey.key = apikey.key
    db_apikey.is_active = apikey.is_active
    db_apikey.bulk_ioc_lookup = apikey.bulk_ioc_lookup
    
    db.commit()
    db.refresh(db_apikey)
    logging.info(f"Updated API key: {name}")
    return db_apikey.to_dict()

# Get all API keys with their configuration status
@router.get("/api/apikeys/configured", response_model=Dict[str, bool], tags=["Settings"])
def get_all_apikeys_configured(db: Session = Depends(get_db)):
    """Get the configuration status (has actual key value) for all API keys."""
    apikeys = get_apikeys(db)
    return {apikey.name: bool(apikey.key and apikey.key.strip()) for apikey in apikeys}