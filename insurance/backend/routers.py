from fastapi import APIRouter 
from src.endpoints.documents import router as documents_router

router = APIRouter()

router.include_router(documents_router, prefix="/documents", tags=["documents"])