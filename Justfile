default: serve

[working-directory("server")]
serve:
    cargo run -- --any-origin

[working-directory("web")]
watch:
    npm run watch
