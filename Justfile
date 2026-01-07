default: up && serve

up:
    docker compose up -d

[working-directory: "server"]
serve:
    cargo run --no-default-features -- --any-origin

[working-directory: "web"]
get:
    npm ci

[working-directory: "web"]
watch:
    npm run watch

db:
    psql postgresql://conartist:conartist@localhost:5432/conartist

[working-directory: "database"]
migration name:
    diesel migration generate {{name}}

[working-directory: "database"]
migrate:
    diesel migration run

[working-directory: "dev/import-conventions/"]
import +args:
    cargo run -- {{args}}
