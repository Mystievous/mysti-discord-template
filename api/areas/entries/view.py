from typing import Annotated
from fastapi import Depends
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter

from areas.entries.repository import EntryRepository
from db.connection import DatabaseDependency
from areas.entries.models import EntryCreate, EntryPublic
from db.tables import Entry

router = InferringRouter()


@cbv(router)
class EntryRouter:

    # Dependencies
    entry_repository: EntryRepository = Depends(EntryRepository)

    # Routes
    @router.put("/entry", response_model=EntryPublic)
    async def create_entry(self, entry: EntryCreate) -> Entry:
        return await self.entry_repository.create_entry(name=entry.name)
