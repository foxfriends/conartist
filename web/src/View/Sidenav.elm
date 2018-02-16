module View.Sidenav exposing (view)
import Html exposing (Html, div, a, text)
import Html.Attributes exposing (class, href)
import Html.Events exposing (onWithOptions, onClick)
import Json.Decode as Decode

import Msg exposing (Msg(..))
import View.List exposing (list, row, clickable)
import View.Drawer exposing (drawer)
import Model.Model exposing (Model)
import Update.Actions exposing (doSignOut)
import Paths

navigateTo : String -> List (Html.Attribute Msg)
navigateTo url =
  let options =
    { stopPropagation = False
    , preventDefault = True }
  in
    [ onWithOptions "click" options (Decode.succeed <| DoNav url)
    , href url ]

-- TODO: the items are tab focusable even when the sidenav is hidden
view : Model -> Html Msg
view { sidenavVisible } =
  let
    items =
      [ (navigateTo Paths.dashboardPath, "Dashboard")
      , (navigateTo Paths.inventoryPath, "Inventory")
      , (navigateTo Paths.pricingPath, "Pricing")
      , (navigateTo Paths.conventionsPath, "Conventions")
      , (navigateTo Paths.settingsPath, "Settings")
      , (doSignOut, "Sign Out") ]
    contents =
      list (uncurry navListRow) items
  in
    drawer sidenavVisible ToggleSidenav [] [ contents ]

navListRow : List (Html.Attribute Msg) -> String -> Html Msg
navListRow attrs title =
  a ([ class "ca__nav-link", row] ++ clickable ++ attrs) [text title]
