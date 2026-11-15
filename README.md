# Mystievous' Discord Bot Template

## Info

This template uses [Discord.js](https://discord.js.org/) and [FastAPI](https://fastapi.tiangolo.com/) to assemble a database-enabled extensible discord bot.

Included in the repo is the discord bot framework, and a basic python backend using [FastAPI](https://fastapi.tiangolo.com/) and [SQLAlchemy](https://www.sqlalchemy.org/).
The example command that uses this backend can be found under `./bot/commands/example/database.ts`

## Requirements

- [Node](https://nodejs.org/en) (26.0.0 or higher)
- [Python](https://www.python.org/) (3.14 or higher)
  - [uv](https://docs.astral.sh/uv/)
- [Just](https://github.com/casey/just)
  - This is used to easily organize and define commands that need to be run to develop the project.

### (Optional) Devenv

This repository is also set up fully with a [devenv](https://devenv.sh/) project definition, allowing for easily setting up the entire development environment without manually installing the packages globally.

## Testing/Running the Bot

1. Install library dependencies
   1. If you're using devenv this should be done already
   2. Otherwise, run `just install` and it will install the python libraries, then the npm packages
      - this uses `uv sync`, which automatically sets up a venv for you with the proper dependencies
2. Configure the environment variables as described in both `./bot/envs/template.env` and `./api/envs/template.env`.
   - To generate the API key for the bot, run `just generate-api-key`
3. Set up the backend database and generate the schema definition
   1. run `just generate-api-client` to generate the API client
   2. run `just api::migrate` to run any outstanding database migrations
4. Finally, run `just dev` to run the bot and API in dev mode.
   - You also can run each service individually with `just api dev` and `just bot dev`
5. To run in "production" mode, use `just start` instead. This will run it without reloading on file changes.

## Development Documentation

Documentation can be found contained in `README.md` files in each folder, [`./bot`](./bot/README.md) and [`./api`](./api/README.md)
