module Init exposing (init)
import Navigation exposing (Location)
import Date
import Task

import Model exposing (Model)
import Msg exposing (Msg(..))
import LocalStorage
import User
import Page
import Dialog exposing (Dialog(..))

init : Location -> (Model, Cmd Msg)
init loc =
  { user = User.new
  , authtoken = ""
  , page = Page.Loading
  , dialog = None
  , now = Date.fromTime 0
  , show_discontinued = False
  , sidenav_visible = False
  , location = Just loc
  , mouse = { x = 0, y = 0 } }
  ! [ LocalStorage.get "authtoken"
    , Task.perform SetDate Date.now ]
