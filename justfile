mod bot
mod api

# Shows all available commands
list:
    just --list

# Install python and node dependencies (for local editor, linting, and code generation)
install: api::install bot::install

# Generate API schema and typescript code
generate-api-client: api::generate-openapi bot::generate-api-client

# =======
# DOCKER
# =======

# Starts the bot and API, restarting on file changes
dev:
    docker compose up --build --watch --menu=false

# Builds and starts the bot and API in the background
start:
    docker compose up -d build

# Stops the bot and API
down:
    docker compose down

# Shows the bot and API logs
logs:
    docker compose logs -f

# Pulls the latest code and rebuilds
update:
    git pull
    just start

# Deploy bot commands
deploy:
    docker compose run --rm bot npm run deploy-commands

# Generate an API key
generate-api-key *purpose="bot":
    docker compose run --rm --build api alembic upgrade head
    docker compose run --rm api python generate-api-key.py "{{ purpose }}"
