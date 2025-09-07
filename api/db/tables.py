from sqlalchemy import PrimaryKeyConstraint, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class BaseTable(DeclarativeBase):
    pass


class Entry(BaseTable):
    __tablename__ = "entries"
    __table_args__ = (
        PrimaryKeyConstraint("id", name="entries_pk"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(45), nullable=False)