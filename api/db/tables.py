import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    MetaData,
    PrimaryKeyConstraint,
    String,
    UniqueConstraint,
    Uuid,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class BaseTable(DeclarativeBase):
    metadata = MetaData(
        naming_convention={
            "pk": "%(table_name)s_pk",
            "uq": "%(table_name)s_%(column_0_N_name)s_uq",
            "ix": "%(table_name)s_%(column_0_N_name)s_idx",
            "fk": "%(table_name)s_%(column_0_name)s_fkey",
            "ck": "%(table_name)s_%(constraint_name)s_ck",
        }
    )


class Entry(BaseTable):
    __tablename__ = "entries"
    __table_args__ = (
        PrimaryKeyConstraint("id"),
        UniqueConstraint("name"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(45), nullable=False)


class APIKey(BaseTable):
    __tablename__ = "api_keys"
    __table_args__ = (
        PrimaryKeyConstraint("id"),
        UniqueConstraint("key"),
        UniqueConstraint("purpose"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), nullable=False)
    purpose: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
