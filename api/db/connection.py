import logging
from typing import Annotated

from fastapi import Depends
from pydantic_settings import BaseSettings

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from db.tables import BaseTable

logger = logging.getLogger(__name__)


class DatabaseSettings(BaseSettings):
    database_uri: str

    class Config:
        env_file = "envs/.env"
        env_file_encoding = "utf-8"


settings = DatabaseSettings()  # type: ignore

engine = create_engine(settings.database_uri, echo=False)


def initialize_database():
    logger.info("Initializing database...")
    BaseTable.metadata.create_all(engine)
    logger.info("Database initialized.")


def get_session():
    with Session(engine) as session:
        yield session


DatabaseDependency = Annotated[Session, Depends(get_session)]
