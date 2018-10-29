# ConArtist Dev Tools

Exposed from the server when it is run with the `--dev` flag. Doesn't do much yet, but hopefully
from here it will be possible to view test reports, run tests, and send requests to the API.

## GraphiQL interface

Automatically produced by the server, provides a handy interface for constructing and sending
GraphQL requests. Requires the server to be run with `--open` and `--any-origin` for some reason...
Even though it's on the same origin. Hopefully this can be fixed in the future.
