mod bot
mod api

# Shows all available commands
list:
    just --list

# Generate API schema and typescript code
generate-api-client: api::generate-openapi

# Install pip and yarn dependencies
install: bot::install api::install

# Starts both the bot and the API in development mode
[parallel]
dev: bot::dev api::dev

# Starts both the bot and the API
[parallel]
start: bot::start api::start
