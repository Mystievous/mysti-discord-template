from fastapi import APIRouter, Depends

from areas.entries.view import router as entry_router
from core.dependencies import api_key_auth

# Every route included here (mounted under /api) requires a valid `api-key`
# header. Routes registered directly on `app` (e.g. /healthcheck) are public.
router = APIRouter(
    dependencies=[Depends(api_key_auth)],
)

router.include_router(entry_router, prefix="/entries", tags=["entries"])
