list:
    just --list

dev-bot:
    cd bot && yarn dev

dev-api:
    cd api && fastapi dev

[parallel]
dev: dev-bot dev-api
