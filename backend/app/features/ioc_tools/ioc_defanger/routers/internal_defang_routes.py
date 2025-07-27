from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.features.ioc_tools.ioc_defanger.service.defang_service import batch_process_iocs


router = APIRouter()

class DefangRequest(BaseModel):
    text: str
    operation: str = 'defang'  # 'defang' or 'fang'

@router.post("/api/defang/", tags=["IOC Defanger"])
async def process_iocs(request: DefangRequest):
    """
    Process IOCs for defanging or fanging with type detection.
    
    Args:
        request: Contains text with IOCs and operation type ('defang' or 'fang')
        
    Returns:
        Array of objects with original, processed, types, and changed status
    """
    try:
        if request.operation not in ['defang', 'fang']:
            return JSONResponse(
                status_code=400, 
                content={"error": "Operation must be 'defang' or 'fang'"}
            )
        
        result = batch_process_iocs(request.text, request.operation)
        return result
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
