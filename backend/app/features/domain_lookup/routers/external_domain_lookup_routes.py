from fastapi import APIRouter
from app.core.database import engine
from app.features.domain_lookup.service.domain_lookup_service import urlscanio_async
from app.core.dependencies import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/api/url/urlscanio/{domain}", tags=["IOC Lookup"])
async def get_urlscan_data(domain: str):
    results = await urlscanio_async(domain)
    if not results:
        raise HTTPException(status_code=404, detail="No data found or an error occurred")
    return results