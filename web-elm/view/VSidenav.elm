module VSidenav exposing (view)
import Html exposing (Html, div, a, text)
import Html.Attributes exposing (class, href)
import Html.Events exposing (onWithOptions)
import Json.Decode as Decode

import Model exposing (Model)
import Msg exposing (Msg(..))
import Lists exposing (list)
import Routing

navigateTo : String -> List (Html.Attribute Msg)
navigateTo url =
  let options =
    { stopPropagation = False
    , preventDefault = True }
  in
    [ onWithOptions "click" options (Decode.succeed <| DoNav url)
    , href url ]

doSignOut : List (Html.Attribute Msg)
doSignOut =
  let
    options =
      { stopPropagation = False
      , preventDefault = True }
  in let url = Routing.signInPath in
     [ onWithOptions "click" options (Decode.succeed <| DoSignOut )
     , href url ]

view : Model -> Html Msg
view { sidenav_visible } =
  let visibility = class <| if sidenav_visible then "ca__sidenav--open" else "" in
  let items =
    [ (navigateTo Routing.dashboardPath, "Dashboard")
    , (navigateTo Routing.inventoryPath, "Inventory")
    , (navigateTo Routing.pricingPath, "Pricing")
    , (navigateTo Routing.conventionsPath, "Conventions")
    , (doSignOut, "Sign Out") ] in
  div [ class "ca__sidenav", visibility ] [ list navListRow items ]

navListRow : (List (Html.Attribute Msg), String) -> Html Msg
navListRow (attrs, title) =
  a ([ class "ca__nav-link list__row list__row--clickable"] ++ attrs) [text title]
