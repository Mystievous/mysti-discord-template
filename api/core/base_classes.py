from pydantic import BaseModel

from db.connection import DatabaseDependency


class BaseAppModel(BaseModel):
    class Config:
        from_attributes = True


class BaseRepository:
    pass


class DatabaseRepository(BaseRepository):
    def __init__(self, session: DatabaseDependency):
        super().__init__()
        self.session = session
