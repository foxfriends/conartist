module Init exposing (init)
import Navigation exposing (Location)

import Model exposing (Model)
import Msg exposing (Msg)
import Routing exposing (parseLocation)
import LocalStorage
import User

init : Location -> (Model, Cmd Msg)
init loc =
  ( { user = User.new
    , authtoken = ""
    , page = parseLocation loc }
  , LocalStorage.get "authtoken" )
