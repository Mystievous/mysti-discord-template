from fastapi.openapi.utils import get_openapi
from main import app
import json


with open("openapi.json", "w") as f:
    json.dump(
        app.openapi(),
        f,
    )
