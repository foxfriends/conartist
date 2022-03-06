# ConArtist Web Dashboard

## Initial setup

1.  Make sure you have [Node.js](https://nodejs.org/en/) and NPM installed. Just use the latest
    version of both.
2.  Install all JS packages with `npm install`. This will also build everything.
3.  Done already!

## Building the project

Rebuild the project at any time with `npm run build`. It takes a little while. `npm run watch` will
build continuously.

## Serving the project

Requires the use of the server. See `/server/README.md` for details.

## Adding/upgrading dependencies

Always go for the latest and greatest. Do not succumb to technical debt. Make a note of it in your
commit messages when `npm install` needs to be run again so that nobody is left confused about why
everything is broken.

## Generating Schemas

To run the `./generate-schemas` script requires installing NPM packages `apollo` and `graphql` globally.
Something is wrong with Apollo that the CLI doesn't work when you install it from the `package.json`.

Use the version from `package.json` though, those work fine.
