default: up && serve

up:
    docker compose up -d

[working-directory: "server"]
serve:
    cargo run -- --any-origin

[working-directory: "web"]
get:
    npm ci

[working-directory: "web"]
watch:
    npm run watch
