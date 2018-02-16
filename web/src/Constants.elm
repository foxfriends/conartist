module Constants exposing (baseURL)

{-| The base url to resolve all API requests to.
-}
baseURL : String
baseURL = herokuServer

localServer : String
localServer = ""

herokuServer : String
herokuServer = "https://con--artist.herokuapp.com"
