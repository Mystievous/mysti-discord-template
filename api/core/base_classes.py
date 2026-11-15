from pydantic import BaseModel, ConfigDict

from db.connection import DatabaseDependency


class BaseAppModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class BaseRepository:
    pass


class DatabaseRepository(BaseRepository):
    def __init__(self, session: DatabaseDependency):
        super().__init__()
        self.session = session
