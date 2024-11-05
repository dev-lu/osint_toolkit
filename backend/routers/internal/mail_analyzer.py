from fastapi import APIRouter, UploadFile
from sqlalchemy.orm import Session
from database.database import engine
from database import models
import email_analyzer


router = APIRouter()
models.Base.metadata.create_all(bind=engine)


@router.post("/api/mailanalyzer/", tags=["OSINT Toolkit modules"])
async def create_upload_file(file: UploadFile):
    return email_analyzer.analyze_email(file.file.read())