from contextlib import asynccontextmanager
from fastapi.params import Depends
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

import dotenv
from fastapi import FastAPI, Request, status

from core.dependencies import api_key_auth
from core.router import router

dotenv.load_dotenv("envs/.env")


# Define FastAPI app with lifespan events
# This is where you can add startup and shutdown events if needed
@asynccontextmanager
async def lifespan(_app: FastAPI):
    # startup

    yield
    # shutdown

    pass


app = FastAPI(lifespan=lifespan)


app.include_router(router, prefix="/api", dependencies=[Depends(api_key_auth)])


# SQLAlchemy Integrity Error Handler
# Handles database integrity errors such as unique constraint violations
@app.exception_handler(IntegrityError)
async def sql_integrity_error_handler(request: Request, exc: IntegrityError):
    if "unique constraint" in str(exc).lower():
        # Unique violation
        status_code = status.HTTP_409_CONFLICT
    else:
        # Generic integrity error
        # Could be foreign key violation, check constraint violation, etc.
        # For simplicity, return 400 Bad Request for all other integrity errors
        # as they usually indicate a client error
        status_code = status.HTTP_400_BAD_REQUEST
    return JSONResponse(status_code=status_code, content={"detail": str(exc)})


@app.get("/healthcheck")
async def healthcheck() -> dict:
    return {"status": "ok"}
