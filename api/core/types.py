from typing import Annotated

from pydantic import Field, PlainSerializer, WithJsonSchema

# Use in pydantic models for Discord IDs, sent as strings so JS doesn't lose precision
Snowflake = Annotated[
    int,
    Field(ge=0, lt=2**63),
    PlainSerializer(str, return_type=str, when_used="json"),
    WithJsonSchema({"type": "string", "pattern": "^[0-9]+$"}),
]
