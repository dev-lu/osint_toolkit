from fastapi import APIRouter, UploadFile
from app.features.email_analyzer.service.email_analyzer_service import analyze_email

router = APIRouter()

@router.post("/api/mailanalyzer/", tags=["Mail Analyzer"])
async def create_upload_file(file: UploadFile):
    return analyze_email(file.file.read())
