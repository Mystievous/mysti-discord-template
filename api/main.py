from contextlib import asynccontextmanager

import dotenv
from fastapi import FastAPI

from areas.entries.models import EntryCreate, EntryPublic
from core.router import router
from db.tables import Entry
from db.connection import create_db_and_tables, DatabaseDependency

dotenv.load_dotenv("envs/.env")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # startup

    # Automatically create the database and tables
    # from any model that inherits from SQLModel
    create_db_and_tables()

    yield

    # shutdown
    pass


app = FastAPI(lifespan=lifespan)

app.include_router(router, prefix="/api")


@app.get("/healthcheck")
async def healthcheck() -> dict:
    return {"status": "ok"}
