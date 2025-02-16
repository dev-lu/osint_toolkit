from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from modules import ioc_extractor
from modules import email_analyzer


router = APIRouter()

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
                
        result = ioc_extractor.extract_iocs(file_contents_str)
        return result
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})






