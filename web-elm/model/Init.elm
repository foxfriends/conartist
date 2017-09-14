module Init exposing (init)
import Navigation exposing (Location)
import Date
import Task

import Model exposing (Model)
import Msg exposing (Msg(..))
import Routing exposing (parseLocation)
import LocalStorage
import User

init : Location -> (Model, Cmd Msg)
init loc =
  ( { user = User.new
    , authtoken = ""
    , page = parseLocation loc
    , now = Date.fromTime 0
    , sidenav_visible = False}
  , Cmd.batch
    [ LocalStorage.get "authtoken"
    , Task.perform SetDate Date.now ] )
