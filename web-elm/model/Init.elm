module Init exposing (init)
import Navigation exposing (Location)

import Model exposing (Model)
import Msg exposing (Msg)
import Routing exposing (parseLocation)
import LocalStorage

init : Location -> (Model, Cmd Msg)
init loc =
  ( { user = Nothing
    , authtoken = ""
    , page = parseLocation loc }
  , LocalStorage.get "authtoken" )
