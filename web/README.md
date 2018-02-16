# ConArtist Web Dashboard

## Initial setup

1.  Make sure you have [Node.js](https://nodejs.org/en/) and NPM installed. Just use the latest
    version of both.
2.  Install all JS and Elm packages with `npm install`. This will also build everything.
3.  Done already!

## Building the project

Rebuild the project at any time with `npm run build`. It takes a little while.

Sadly there is no automatic build watching at this time. The usual `webpack --watch` doesn't
actually watch anything because of the Elm loader. Something is probably wrong with the setup.
You'll need to rebuild after modifying any `.elm`, `.sass`, or `.js` file until someone gets around
to making a watcher work.

## Serving the project

Requires the use of the server. See `/server/README.md` for details.

I'll hopefully set something up to use the production server as the backend so that you don't have
to start your own instance.

## Adding/upgrading dependencies

Always go for the latest and greatest. Do not succumb to technical debt. Make a note of it in your
commit messages when `npm install` needs to be run again so that nobody is left confused about why
everything is broken.
