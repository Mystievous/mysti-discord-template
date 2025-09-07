from typing import Annotated
from pydantic import Field
from api.core.base_classes import BaseAppModel


class EntryBase(BaseAppModel):
    name: Annotated[str, Field(max_length=45)]


class EntryPublic(EntryBase):
    id: int


class EntryCreate(EntryBase):
    pass
