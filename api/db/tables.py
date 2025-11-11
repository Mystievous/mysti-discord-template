from datetime import datetime
import uuid
from sqlalchemy import (
    DateTime,
    PrimaryKeyConstraint,
    String,
    UniqueConstraint,
    Uuid,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class BaseTable(DeclarativeBase):
    pass


class Entry(BaseTable):
    __tablename__ = "entries"
    __table_args__ = (
        PrimaryKeyConstraint("id", name="entries_pk"),
        UniqueConstraint("name", name="entries_name_uq"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(45), nullable=False)


class APIKey(BaseTable):
    __tablename__ = "api_keys"
    __table_args__ = (
        PrimaryKeyConstraint("id", name="api_keys_pk"),
        UniqueConstraint("key", name="api_keys_key_uq"),
        UniqueConstraint("purpose", name="api_keys_purpose_uq"),
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
