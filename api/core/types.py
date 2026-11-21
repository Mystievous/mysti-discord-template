from datetime import UTC, datetime
from typing import Annotated

from pydantic import Field, PlainSerializer, WithJsonSchema
from sqlalchemy import DateTime, TypeDecorator


# SQLite drops offsets, so store UTC and put the tzinfo back on read.
# Pydantic models for input should use AwareDatetime, instead of raw datetime.
class UTCDateTime(TypeDecorator):
    impl = DateTime(timezone=True)
    cache_ok = True

    def process_bind_param(self, value: datetime | None, dialect):
        if value is None:
            return None
        if value.tzinfo is None:
            raise ValueError("naive datetime, pass an aware one")
        return value.astimezone(UTC)

    def process_result_value(self, value: datetime | None, dialect):
        if value is None:
            return None
        if value.tzinfo is None:
            return value.replace(tzinfo=UTC)
        return value.astimezone(UTC)


# Use in pydantic models for Discord IDs, sent as strings so JS doesn't lose precision
Snowflake = Annotated[
    int,
    Field(ge=0, lt=2**63),
    PlainSerializer(str, return_type=str, when_used="json"),
    WithJsonSchema({"type": "string", "pattern": "^[0-9]+$"}),
]
