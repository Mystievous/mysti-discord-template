from typing import Any

from pydantic import BaseModel


# Body of every error response: FastAPI's HTTPException
# and our exception handlers both return `{"detail": "..."}`
class ErrorResponse(BaseModel):
    detail: str


type Responses = dict[int | str, dict[str, Any]]


# Reusable OpenAPI response entries. Combine them  with `|` e.g.
# `responses=CONFLICT | NOT_FOUND`. A route's own entry for a status
# code replaces any inherited model for that code.
CONFLICT: Responses = {
    409: {
        "model": ErrorResponse,
        "description": "A record with these values already exists.",
    }
}
NOT_FOUND: Responses = {
    404: {
        "model": ErrorResponse,
        "description": "Record not found.",
    }
}
