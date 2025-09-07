from pydantic import BaseModel


class BaseAppModel(BaseModel):
    class Config:
        orm_mode = True


class BaseRepository:
    pass