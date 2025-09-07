# Mystievous' Discord Bot Template

## Info
This template uses [Discord.js](https://discord.js.org/) and [FastAPI](https://fastapi.tiangolo.com/) to assemble a database-enabled extensible discord bot.

Included in the repo is the discord bot framework, and a basic python backend using [FastAPI](https://fastapi.tiangolo.com/) and [SQLAlchemy](https://www.sqlalchemy.org/).
The example command using this can be found in `./bot/commands/example/database.ts`

## Requirements
- [Node](https://nodejs.org/en) with Corepack enabled
- [Python](https://www.python.org/) (3.10 or higher)
- (Optional) [Just](https://github.com/casey/just)
  - A command runner that simplifies developing/running the bot.

## Testing/Running the Bot
1. Navigate to `./bot`, and run `yarn install` to install the required node modules.
2. Navigate to `./api`, and run `pip install -r requirements.txt` to install the required python libraries.
   -  It is recommended to use a [python virtual environment (venv)](https://docs.python.org/3/library/venv.html) for this.
3. Configure the environment variables in `./bot/envs/` and `./api/envs/` as described in `./bot/envs/template.env` and `./api/envs/template.env`.
4. run `just dev` to build and run the bot in dev mode.
   - Alternatively, you can manually run the dev commands specified in the `justfile`.

## Development Documentation
Documentation can be found contained in `README.md` files  each folder, `./bot` and `./api`