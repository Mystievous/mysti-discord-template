from typing import Annotated
from db.connection import DatabaseDependency
from db.tables import Entry
from core.base_classes import BaseRepository


class EntryRepository(BaseRepository):

    def __init__(
        self,
        session: DatabaseDependency
    ):
        super().__init__()
        self.session = session

    async def create_entry(self, name: str) -> Entry:
        entry = Entry(name=name)
        self.session.add(entry)

        self.session.commit()
        self.session.refresh(entry)

        return entry
