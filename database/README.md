# ConArtist Database

## Initial setup

1.  Install [PostgreSQL](https://www.postgresql.org/download/). The latest version should work.
2.  Follow the instructions to make sure the Postgres service is running. It's probably automatic!
3.  Create the database by running the `create.sql` file.

## Default data

Some test data is available in `test-data.sql`. Feel free to add whatever you like to this. Try to
not fill it with all garbage names (some edge cases are welcome though) so that you get a feeling
of how the app will really look in production.

## Accessing the database

Sign in with the root (`postgres`) user, and switch to the ConArtist database (`\c conartist`). I
have no idea what happens to the users that are listed in the create file. The actual server uses
one of those, so don't change the credentials.

## Copying the production database

It's possible, but requires access to the Heroku server. If you really need this, I can figure out
how to share access, or find a way to save my database to a file you can import.

## Resetting the database

Sometimes you have to. Just run `destroy.sql`, then `create.sql`, and you'll have a fresh database!
