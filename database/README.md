# ConArtist Database

## Initial setup

1.  Install [PostgreSQL](https://www.postgresql.org/download/). The latest version should work.
2.  Follow the instructions to make sure the Postgres service is running. It's probably automatic!
3.  Install Diesel CLI: `cargo install diesel_cli --no-default-features --features "postgres"`
4.  Make a `.env` file with `DATABASE_URL="<database url goes here>"`
5.  Run `diesel setup` and it should be good to go

After that, running `diesel migration run` when there are new migrations should be all that's
needed!

## Accessing the database

Sign in with the root (`postgres`) user, and switch to the ConArtist database (`\c conartist`). I
have no idea what happens to the users that are listed in the create file. The actual server uses
one of those, so don't change the credentials.

## Copying the production database

It's possible, but requires access to the Heroku server. If you really need this, I can figure out
how to share access, or find a way to save my database to a file you can import.

## Resetting the database

Just reset with Diesel: `diesel reset`
