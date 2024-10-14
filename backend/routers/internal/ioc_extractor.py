from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from dependencies import get_db
from database import crud, models, schemas
from database.database import engine
from database.models import Settings
from database.schemas import ModuleSettingsSchema, ModuleSettingsCreateSchema
import ioc_extractor
import email_analyzer
import logging
from typing import Dict, Any

router = APIRouter()
models.Base.metadata.create_all(bind=engine)

# (File is for smaller files)
@router.post("/api/extractor/", tags=["OSINT Toolkit modules"])
async def create_file(file: UploadFile = File(...)):
    try:
        file_contents = await file.read()
        result = ioc_extractor.extract_iocs(file_contents)
        return result
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

# (UploadFile is for larger files)
@router.post("/api/mailanalyzer/", tags=["OSINT Toolkit modules"])
async def create_upload_file(file: UploadFile):
    return email_analyzer.analyze_email(file.file.read())





