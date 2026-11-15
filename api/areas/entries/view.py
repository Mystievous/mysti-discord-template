from fastapi import APIRouter

from db.tables import Entry

from .models import EntryCreate, EntryPublic
from .repository import EntryRepoDep

router = APIRouter()


# Return the SQLAlchemy model directly. `response_model` is how we tell
# fastapi what type it should actually be returning to the client.
#
# `response_model` must be a pydantic type.
#
# Routes should also be plain `def`, not `async def`, since our SQLAlchemy
# session is blocking.
@router.post(
    "/",
    response_model=EntryPublic,
    summary="Create a new entry.",
    responses={409: {"description": "An entry with that name already exists."}},
)
def create_entry(entry_repository: EntryRepoDep, entry: EntryCreate) -> Entry:
    return entry_repository.create_entry(name=entry.name)
