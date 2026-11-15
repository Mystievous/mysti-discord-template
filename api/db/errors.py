import sqlite3

from sqlalchemy.exc import IntegrityError

POSTGRESQL_UNIQUE_ERROR = "23505"


# Detects unique + primary key violations using the database driver's error
# codes. This supports SQLite and PostgreSQL currently.
# Other databases return False, so their violations would fall through
# to a 400 instead of a 409.
def is_unique_violation(exc: IntegrityError) -> bool:
    orig = exc.orig
    if isinstance(orig, sqlite3.IntegrityError):
        return orig.sqlite_errorname in (
            "SQLITE_CONSTRAINT_UNIQUE",
            "SQLITE_CONSTRAINT_PRIMARYKEY",
        )
    return POSTGRESQL_UNIQUE_ERROR in (
        getattr(orig, "sqlstate", None),
        getattr(orig, "pgcode", None),
    )
