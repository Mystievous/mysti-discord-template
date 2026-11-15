# FastAPI Application

This is the layer of the bot that deals with the database and other services directly.

# Database

The database table definitions are found in `./api/db/tables.py`.

These are SQLAlchemy table models.

Each one defines its table name, any constraints, and all columns present in that table.

It is important that each constraint includes a specific name, even ones like Primary Keys and Unique Keys that can technically be set directly from `mapped_column`. This is for database migration purposes with alembic.

```py
class Entry(BaseTable):
    __tablename__ = "entries"
    __table_args__ = (
        PrimaryKeyConstraint("id", name="entries_pk"),
        UniqueConstraint("name", name="entries_name_uq"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(45), nullable=False)
```

# Areas
Areas are how we categorize our routes. For example, if you have many routes pertaining to `users` (i.e. creating, updating, deleting, etc.), then those would go in a `areas/users` directory.

Each area contains 3 python files.
- `models.py`
  - This contains any needed pydantic definitions for the inputs and outputs of that area's endpoints.
- `view.py`
  - This is simply where the endpoints themselves are defined.
  - Most real logic will go in `repository.py`
- `repository.py`
  - This is where "business logic" goes, and where the database is written to/read from.

This follows a fairly standard model/view/controller structure as seen in many production environments.

The `router` for each area's view is then included in `./api/core/router.py` like such:

```py
router.include_router(entry_router, prefix="/entries", tags=["entries"])
```

The tags allow us to easily organize them when viewing the generated docs, and when generating typescript code.

Every route included in this router (mounted under `/api`) requires a valid `api-key` header. Routes registered directly on `app` in `main.py` (e.g. `/healthcheck`) are public.

# Models

Models are defined as [pydantic](https://docs.pydantic.dev/latest/) models, which extend the custom `BaseAppModel` from `core/base_classes.py`. This would be an example `model.py` file for reading and writing to/from the database.

```py
from typing import Annotated
from pydantic import Field
from core.base_classes import BaseAppModel

class EntryBase(BaseAppModel):
    name: Annotated[str, Field(max_length=45)]

class EntryPublic(EntryBase):
    id: int

class EntryCreate(EntryBase):
    pass

class EntryUpdate(EntryBase):
    pass
```

- `*Base` is the class all the others are extended from
- `*Public` is the one that is exposed as the endpoint responses
- `*Create` is the input model for creating the object
- `*Update` is the input model for updating the object

These are not strictly required, and are not the only possible configuration for the models, but it is recommended to stay similar to it.

Note the use of `Annotated` to define the specific `Field` restrictions. This is the recommended way to configure these.

# Views

The views are where endpoints are defined.

They are plain functions on an `APIRouter`. Dependencies like the Repository classes (see "Areas" above) are passed in as parameters, using an `Annotated` alias (e.g. `EntryRepoDep`, defined in `repository.py`) so they can be shared between all the endpoints without repetition of code.

Following our `entry` examples, this is the `view.py` associated.
```py
from fastapi import APIRouter

from core.responses import CONFLICT
from db.tables import Entry

from .models import EntryCreate, EntryPublic
from .repository import EntryRepoDep

router = APIRouter()


@router.post(
    "/",
    response_model=EntryPublic,
    summary="Create a new entry.",
    responses=CONFLICT,
)
def create_entry(entry_repository: EntryRepoDep, entry: EntryCreate) -> Entry:
    return entry_repository.create_entry(name=entry.name)
```

- `response_model` is the class from `.models` that  exposes any information that should be visible to the bot. The function itself can return the SQLAlchemy table object directly, and FastAPI converts it.<br/>
- `summary` is a basic summary of the endpoint's function.
- `responses` documents any extra responses the endpoint can return (like `CONFLICT` for a 409), using the shared definitions in `core/responses.py`. These get typed in the generated typescript too. Combine them with `|`, e.g. `responses=CONFLICT | NOT_FOUND`. The API key errors are already added to every route in `core/router.py`.
- The endpoint's openapi name (its "operation ID") is generated automatically from the function name in camelCase (`create_entry` -> `createEntry`). This is what the resulting function will be named when generated into typescript, so function names must be unique across all endpoints. To override it, pass `operation_id=` to the route decorator.

Endpoints should be plain `def` functions, not `async def`, since the database session is blocking. FastAPI runs `def` endpoints in a threadpool so they don't block the server.

# Alembic (Database Migrations)

Database migrations are handled by Alembic. 

Any time a change is made to the `tables.py` definitions for the database tables, it can be autogenerated as a migration by running `just api revise <revision_message>`. 

Then, to apply all un-applied migrations, it's as simple as running `just api migrate`. 

To undo the last (one) revision, you can run `just api rollback`.

For more advanced usage, reference the alembic docs to use the commands directly.

> [!Warning]
> If there is important data in the database, it is highly recommended to manually review the generated revisions in the `./api/alembic/versions` directory before running them.