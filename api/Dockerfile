FROM python:3.14-slim

# uv binary from the official image, pinned to the version used in CI
COPY --from=ghcr.io/astral-sh/uv:0.13.8 /uv /bin/uv

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Dependencies first: this layer is cached until pyproject.toml or uv.lock change
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv uv sync --frozen --no-dev

COPY . .

# Run as a non-root user. /data holds the SQLite database (a volume from compose)
RUN useradd --system --uid 1001 app && mkdir -p /data && chown app /data
USER app

ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000

# Apply migrations, then start the API
CMD ["sh", "-c", "alembic upgrade head && exec fastapi run --port 8000"]
