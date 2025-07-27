from pydantic import BaseModel


class ApikeySchema(BaseModel):
    """Schema for API key creation and reading."""
    name: str
    key: str = ""
    is_active: bool = False
    bulk_ioc_lookup: bool = False


class DeleteApikeyResponse(BaseModel):
    """Response model for deleting an API key."""
    apikey: ApikeySchema
    message: str


class ApikeyStateResponse(BaseModel):
    """General response for state changes."""
    name: str
    is_active: bool
    
class ApikeyBulkLookupStateResponse(BaseModel):
    """Response model for bulk lookup state."""
    name: str
    bulk_ioc_lookup: bool
