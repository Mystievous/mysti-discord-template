from typing import Optional

from sqlmodel import SQLModel, Field

# For a full guide on how to use SQLModel, refer to:
# https://sqlmodel.tiangolo.com/tutorial/
# and
# https://fastapi.tiangolo.com/tutorial/sql-databases/

class EntryBase(SQLModel):
    name: str = Field(max_length=45)

class Entry(EntryBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class EntryPublic(EntryBase):
    id: int

class EntryCreate(EntryBase):
    pass