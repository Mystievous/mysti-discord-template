from typing import Annotated
import uuid
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from sqlalchemy import select
from sqlalchemy.orm import Session

from db.connection import DatabaseDependency
from db.tables import APIKey


api_key_schema = APIKeyHeader(name="api-key", auto_error=False)


def api_key_auth(
    session: DatabaseDependency, api_key: Annotated[str | None, Depends(api_key_schema)]
) -> bool:
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="API key missing"
        )
    try:
        api_key_uuid = uuid.UUID(api_key)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid API key format"
        )
    api_key_row = session.scalar(select(APIKey).where(APIKey.key == api_key_uuid))
    if not api_key_row:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid API key"
        )
    return True
