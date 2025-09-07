from contextlib import asynccontextmanager

import dotenv
from fastapi import FastAPI

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

app.include_router(router, prefix="/api")


@app.get("/healthcheck")
async def healthcheck() -> dict:
    return {"status": "ok"}
