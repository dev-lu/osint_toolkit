from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import time

router = APIRouter()

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: float

@router.get(
    "/api/healthcheck",
    response_model=HealthResponse,
    summary="Healthcheck endpoint",
    description="Returns the health status of the API",
    tags=["System"]
)
async def healthcheck():
    """
    Healthcheck endpoint that returns:
    - status: "ok" if the service is running
    - version: API version
    - timestamp: current server timestamp
    """
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": "ok",
            "version": "1.0.0",
            "timestamp": time.time()
        }
    )