# The Discord bot
mod bot

# The FastAPI backend
mod api

# Shows all available commands
list:
    just --list

# Starts both the bot and the API in development mode
[parallel]
dev: bot::dev api::dev

# Starts both the bot and the API
[parallel]
start: bot::start api::start