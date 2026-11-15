import logging
from contextlib import asynccontextmanager

import dotenv
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

from core.openapi import operation_id
from core.router import router
from db.errors import is_unique_violation

logger = logging.getLogger(__name__)

dotenv.load_dotenv("envs/.env")


# Define FastAPI app with lifespan events
# This is where you can add startup and shutdown events if needed
@asynccontextmanager
async def lifespan(_app: FastAPI):
    # startup

    yield
    # shutdown


app = FastAPI(
    lifespan=lifespan,
    generate_unique_id_function=operation_id,
)


app.include_router(
    router,
    prefix="/api",
)


# SQLAlchemy Integrity Error Handler
# Fallback for database constraint violations that a route didn't handle itself.
# Clients get a generic message, while the full error can be found in the logs.
@app.exception_handler(IntegrityError)
async def sql_integrity_error_handler(request: Request, exc: IntegrityError):
    logger.warning(
        "Integrity error on %s %s: %s", request.method, request.url.path, exc.orig
    )

    if is_unique_violation(exc):
        # Unique violation
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": "A record with these values already exists."},
        )

    # Foreign key, check constraint, NOT NULL, etc. Usually a client error.
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": "The request violates a database constraint."},
    )


@app.get("/healthcheck")
async def healthcheck() -> dict:
    return {"status": "ok"}
