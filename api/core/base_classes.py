from pydantic import BaseModel


class BaseAppModel(BaseModel):
    class Config:
        from_attributes = True


class BaseRepository:
    pass