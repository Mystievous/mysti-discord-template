from typing import Annotated

from fastapi import Depends

from core.base_classes import DatabaseRepository
from db.tables import Entry


class EntryRepository(DatabaseRepository):
    def create_entry(self, name: str) -> Entry:
        entry = Entry(name=name)
        self.session.add(entry)

        self.session.commit()
        self.session.refresh(entry)

        return entry


# Constructs a new EntryRepository for each endpoint call, with
# their own database session.
EntryRepoDep = Annotated[EntryRepository, Depends()]
