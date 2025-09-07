import logging
from typing import Annotated

from dotenv import dotenv_values
from fastapi import Depends

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from db.tables import BaseTable

logger = logging.getLogger(__name__)

values = dotenv_values("envs/.env")

uri = values.get("DATABASE_URI")

if not uri:
    raise ValueError("DATABASE_URI not found in environment variables")

engine = create_engine(values.get("DATABASE_URI"), echo=True)  # type: ignore


def create_db_and_tables():
    BaseTable.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


DatabaseDependency = Annotated[Session, Depends(get_session)]
