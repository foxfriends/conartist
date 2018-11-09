[Figma]: https://www.figma.com/file/gARds2JGbWtGTY8PJBO5NEJf/ConArtist-iOS

# ConArtist iOS App

The iOS app is currently early in development, and requires much work, but it is at least in a good
state unlike the Android app. iOS is of higher priority because the only confirmed users of the app
(me and Pearl) have iPhones. Hopefully the iOS architecture and designs will serve as examples of
where the Android app should be as well.

I will discuss said architecture at a later date. I barely even know how it works, and it will
likely continue to change for a while yet.

## Setup

1.  Buy/acquire a Mac
2.  Install XCode from the app store. Get the latest version.
3.  Ensure Ruby is installed, and install Cocoapods with `gem install cocoapods`.
4.  Install the dependencies with `pod install`.
5.  Open the `ConArtist.workspace` file and continue as usual.

## API changes

Since the API is using GraphQL, when the server changes we need to regenerate the `schema.json` file
with `apollo-codegen`.

1.  Set up the server (see `/server/README.md`)
2.  Make sure you have [Node.js](https://nodejs.org/en/) and NPM installed. Just use the latest
    version of both.
3.  Install `apollo-cli` from NPM (`npm install -g apollo-cli`)
4.  Run the server in Open mode
5.  Go to the iOS directory, and regenerate the `schema.json` and `resources.json` files with
    `./generate-schemas` (it's in the `ConArtist` directory)

Please note that the iOS project is currently pointing at the production server (Heroku), not the
local one, so you don't need to install or run the server locally. Adding another configuration to
point at the local server would be great.

## Designs

The design specs are available on [Figma]. For permission to edit the project, just ask me and
I'll add you.
