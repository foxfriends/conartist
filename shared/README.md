# ConArtist Shared Assets

Contains all data that is shared between all clients. Though they don't necessarily actually *read*
the data from these files, this is the central source of truth for any value that is to be shared.

## GraphQL

All GraphQL queries are being shared, and should be processed by a code generator as part of the
build process to ensure that all clients are following the same schema. All files in this folder
should be processed together.

## Resources

There is a separate GraphQL API for the resources API, which is stored outside of the GraphQL
folder so that the code generators do not compile this in with the other schema.

## Colors

Colors are stored in integer and string format. The string is `#AARRGGBB`, and the integer is just
the hex value of that.

## Logo

The ConArtist logo, sized to all the sizes required for the different platforms.

## Localization

Localization files are kept in JSON format. The keys should be in human readable English format, and
values as the translated version of the key. Files are named using the IETF language tag format.
Format strings may use `{}` as a placeholder for dynamic content to be added at runtime.
