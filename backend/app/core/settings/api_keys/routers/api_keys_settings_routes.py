from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.core.settings.api_keys.crud.api_keys_settings_crud import get_apikey, get_apikeys, delete_existing_apikey, create_new_apikey
from app.core.settings.api_keys.schemas.api_keys_settings_schemas import ApikeySchema, ApikeyStateResponse, DeleteApikeyResponse
from app.core.settings.api_keys.models.api_keys_settings_models import Apikey
import logging
from typing import Dict, Any


router = APIRouter()

# Create API key
@router.post("/api/apikeys/", response_model=ApikeySchema, tags=["Settings"], status_code=status.HTTP_201_CREATED)
def create_apikey(apikey: ApikeySchema, db: Session = Depends(get_db)):
    existing_apikey = get_apikey(db, apikey.name)
    if existing_apikey['name'] == "None":
        db_apikey = create_new_apikey(db, apikey)
        logging.debug("Added API key: " + str(apikey))
        return db_apikey.to_dict()
    logging.error(
        "Could not add API key. API key already exists:  " + str(apikey))
    raise HTTPException(status_code=409, detail="Apikey already exists")


# Delete API key by name
@router.delete("/api/apikeys", response_model=DeleteApikeyResponse, tags=["Settings"])
def delete_apikey(name: str, db: Session = Depends(get_db)):
    apikey = get_apikey(db, name)
    if apikey['name'] == "None" or not apikey:
        logging.error("Could not delete API key: API key not found")
        raise HTTPException(status_code=404, detail="API key not found")
    delete_existing_apikey(db=db, name=name)
    logging.info("Deleted API key: " + name)
    return DeleteApikeyResponse(apikey=ApikeySchema(**apikey), message="API key deleted successfully")

"""
# Get all API keys
@router.get("/api/apikeys/", response_model=list[ApikeySchema], tags=["Settings"])
def read_apikeys(db: Session = Depends(get_db)):
    apikeys = get_apikeys(db)
    if not apikeys:
        logging.error("Could not get API keys: No API keys found")
        raise HTTPException(status_code=404, detail="No API keys found")
    return [apikey.to_dict() for apikey in apikeys]
"""

"""
# Get API key by name
@router.get("/api/apikeys", response_model=ApikeySchema, tags=["Settings"])
def read_apikey(name: str, db: Session = Depends(get_db)):
    apikey = get_apikey(db, name)
    if apikey is None:
        logging.error("Could not get API key. API key not found: " + name)
        raise HTTPException(status_code=404, detail="Apikey not found")
    return apikey
"""

# Get all API keys state
@router.get("/api/apikeys/is_active", response_model=Dict[str, Any], tags=["Settings"])
def get_all_apikeys_is_active(db: Session = Depends(get_db)):
    apikeys = get_apikeys(db)
    return {apikey.name: apikey.is_active for apikey in apikeys}

# Get specific API key state
@router.get("/api/apikeys/{name}/is_active", response_model=bool, tags=["Settings"])
def get_apikey_is_active(name: str, db: Session = Depends(get_db)):
    apikey = get_apikey(db, name)
    if apikey is None:
        raise HTTPException(status_code=404, detail="Apikey not found")
    return apikey['is_active']

# Change API key state
@router.put("/api/apikeys/{name}/is_active", response_model=ApikeyStateResponse, tags=["Settings"])
def update_apikey_is_active(name: str, is_active: bool, db: Session = Depends(get_db)):
    apikey = get_apikey(db, name)
    if apikey is None:
        raise HTTPException(status_code=404, detail="Apikey not found")
    apikey['is_active'] = is_active
    db.commit()
    return ApikeySchema(**apikey)