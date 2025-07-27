from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.features.ioc_tools.ioc_extractor.service.ioc_extractor_service import extract_iocs


router = APIRouter()

class TextExtractionRequest(BaseModel):
    text: str

@router.post("/api/extractor/", tags=["IOC Extractor"])
async def create_file(file: UploadFile = File(...)):
    try:
        file_contents = await file.read()
        try:
            file_contents_str = file_contents.decode('utf-8')
        except UnicodeDecodeError:
            for encoding in ['latin-1', 'ascii', 'iso-8859-1']:
                try:
                    file_contents_str = file_contents.decode(encoding)
                    break
                except UnicodeDecodeError:
                    continue
            else:
                raise ValueError("Unable to decode file contents with any supported encoding")
                
        result = extract_iocs(file_contents_str)
        return result
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.post("/api/extractor/text/", tags=["IOC Extractor"])
async def extract_from_text(request: TextExtractionRequest):
    """
    Extract IOCs from plain text input.
    This endpoint is used by the defang tool and other components that need IOC recognition.
    """
    try:
        result = extract_iocs(request.text)
        return result
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
