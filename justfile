list:
    just --list

bot-dev:
    cd bot && yarn dev

api-dev:
    cd api && fastapi dev

[parallel]
dev: bot-dev api-dev
