from contextlib import asynccontextmanager

import dotenv
from fastapi import FastAPI

from db.models import Entry
from db.connection import create_db_and_tables, SessionDep

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


@app.put("/entry", response_model=Entry)
async def create_entry(name: str, session: SessionDep) -> Entry:
    entry = Entry(name=name)
    session.add(entry)

    session.commit()
    session.refresh(entry)

    return entry