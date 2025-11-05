from core.base_classes import DatabaseRepository
from db.tables import Entry


class EntryRepository(DatabaseRepository):
    
    async def create_entry(self, name: str) -> Entry:
        entry = Entry(name=name)
        self.session.add(entry)

        self.session.commit()
        self.session.refresh(entry)

        return entry
