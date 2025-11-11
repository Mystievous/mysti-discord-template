mod bot
mod api

# Shows all available commands
list:
    just --list

# Deploy bot commands
alias deploy := bot::deploy

# Generate API schema and typescript code
generate-api-client: api::generate-openapi bot::generate-api-client

# Install pip and yarn dependencies
install: api::install bot::install

# Starts both the bot and the API in development mode
[parallel]
dev: api::dev bot::dev

# Starts both the bot and the API
[parallel]
start: api::start bot::start
