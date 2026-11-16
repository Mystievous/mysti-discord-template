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
- [Docker](https://docs.docker.com/engine/install/) with Docker Compose

### (Optional) Devenv

This repository is also set up fully with a [devenv](https://devenv.sh/) project definition, allowing for easily setting up the entire development environment without manually installing the packages globally.

## Creating a Bot from This Template

This template uses [Copier](https://copier.readthedocs.io/), so bots made from it can pull in later template updates.

To create a new bot:

```sh
copier copy gh:Mystievous/mysti-discord-template my-bot
cd my-bot
git init && git add -A && git commit -m "Create bot from template"
```

To update a bot to the latest template version, run this in the bot's repo (it must be a git repo with no uncommitted changes):

```sh
copier update
```

- Only the template's changes are applied, so your own commands and edits are kept. If you changed the same lines as the template did, they're marked as git conflicts to resolve.
- Example commands you deleted stay deleted, but new examples are still added.
- Keep bot-specific code in `commands/`, `components/` and `areas/` where possible, so updates rarely conflict.
- Don't edit `.copier-answers.yml`; it records which template version the bot was created from.

## Testing/Running the Bot

The bot and API run in Docker, using `./compose.yml`.

1. Install library dependencies (these are still used locally for your editor, linting, and generating code)
   1. If you're using devenv this should be done already
   2. Otherwise, run `just install` and it will install the python libraries, then the npm packages
      - this uses `uv sync`, which automatically sets up a venv for you with the proper dependencies
2. Configure the environment variables as described in both `./bot/envs/template.env` and `./api/envs/template.env`.
   - `API_URL` and `DATABASE_URI` are overridden inside Docker, so leave them as they are.
   - To generate the API key for the bot, run `just generate-api-key` and set it as `API_KEY` in `./bot/envs/.env`
3. Run `just dev` to build and run the bot and API in dev mode. They restart when you change a file, and `Ctrl+C` stops them.
   - Database migrations run automatically whenever the API starts.
4. To run in "production" mode, use `just start` instead. This runs it in the background, without reloading on file changes, and restarts it if it crashes or the server reboots.
   - `just logs` shows the logs, and `just down` stops it.
   - `just update` pulls the latest code and rebuilds.

### Docker Notes

- The database is stored in the `api-data` Docker volume, so it's kept through `just down` and rebuilds.
- The `.env` files are only read when the containers start. After changing them, run `just start` again (or restart `just dev`).
- `just deploy` deploys the bot commands from inside Docker.

> [!WARNING]  
> `docker compose down -v` deletes the volume, and the database with it.

### Without Docker

You can also run each service individually with `just api dev` and `just bot dev`, in separate terminals. The API runs its migrations when it starts, and the database is stored at `./api/database.db`. Use `just api generate-api-key` to generate an API key for it.

## Development Documentation

Documentation can be found contained in `README.md` files in each folder, [`./bot`](./bot/README.md) and [`./api`](./api/README.md)
