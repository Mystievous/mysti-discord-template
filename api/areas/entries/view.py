from fastapi import Depends
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter

from .repository import EntryRepository
from .models import EntryCreate, EntryPublic
from db.tables import Entry

router = InferringRouter()


@cbv(router)
class EntryRouter:

    # Dependencies
    entry_repository: EntryRepository = Depends(EntryRepository)

    # Routes
    @router.get(
        "/",
        response_model=EntryPublic,
        operation_id="createEntry",
        summary="Create a new entry.",
    )
    async def create_entry(self, entry: EntryCreate) -> Entry:
        return await self.entry_repository.create_entry(name=entry.name)
