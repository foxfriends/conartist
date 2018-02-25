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

## Deploying to production

Just tell me to do it. I don't know how to set up another person for my Heroku, and don't really
feel like figuring it out.

The URL for the production server is this: `https://con--artist.herokuapp.com`.

Currently the production build is running with all CORS origins enabled. This should
be removed when convenient, as it is not secure at all.

## The GraphQL file

The GraphQL file here (`schema.graphql`) serves more as documentation of the API than anything else.
It is completely unused. Hopefully someday this file and the GraphQL file in the iOS directory will
be consolidated and shared between all 3 clients.

Despite being unused, please keep the GraphQL file up to date with any API changes.