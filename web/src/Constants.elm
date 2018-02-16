module Constants exposing (baseURL)

{-| The base url to resolve all API requests to.
-}
baseURL : String
baseURL = localServer

localServer = ""
herokuServer = "https://con--artist.herokuapp.com"
