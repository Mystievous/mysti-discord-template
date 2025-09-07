from fastapi import APIRouter

from areas.entries.view import router as entry_router

router = APIRouter()

router.include_router(entry_router, prefix="/entries", tags=["entries"])
