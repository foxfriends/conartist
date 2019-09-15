# ConArtist Server

## Initial setup

1.  Install Rust with [Rustup](https://www.rustup.rs/). Just use the latest version.
2.  Set up the database (see `database/README.md`)
3.  Build and run server with `cargo run`
4.  Assuming you have set up the web project (see `/web/README.md`), you can now view the web
    dashboard at `localhost:8080`

## Open mode

```bash
cargo run -- --open
```

The server supports a single flag, `--open`, which turns off the authentication requirements for the
GraphQL API. Useful for when using Apollo, for example, to introspect the API and generate the
source files. No guarantees the app will actually work correctly in this mode.

## Dev mode

```bash
cargo run -- --dev
```

When testing things it may be helpful to run in dev mode by supplying the `--dev` flag. This
exposes the dev tools at `http://localhost:8080/dev`. Running in dev and open mode will be useful
for testing the GraphQL API as well, to get around the sign in requirements.

## Disable CORS

```bash
cargo run -- --any-origin
```

For development purposes, this flag exists. Turning it on will let any CORS request through. Maybe
not great so turn that off at some point.

## Deploying to production

The URL for the production server is: [https://conartist.app](https://conartist.app).

SSH into that and redeploy by pulling the latest code, rebuilding it, and then restarting the servers.
Don't forget to run any required migrations.
