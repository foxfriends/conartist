module Init exposing (init)
import Navigation exposing (Location)
import Date
import Task

import Model exposing (Model)
import Msg exposing (Msg(..))
import Routing exposing (parseLocation)
import LocalStorage
import User
import Dialog exposing (Dialog(..))

init : Location -> (Model, Cmd Msg)
init loc = let (page, cmd) = parseLocation loc in
  { user = User.new
  , authtoken = ""
  , page = page
  , dialog = None
  , now = Date.fromTime 0
  , show_discontinued = False
  , sidenav_visible = False }
  ! [ LocalStorage.get "authtoken"
    , Task.perform SetDate Date.now
    , cmd ]
