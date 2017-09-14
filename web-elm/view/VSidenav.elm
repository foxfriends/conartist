module VSidenav exposing (view)
import Html exposing (Html, div, a, text)
import Html.Attributes exposing (class, href)
import Html.Events exposing (onWithOptions)
import Json.Decode as Decode

import Model exposing (Model)
import Msg exposing (Msg(..))
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
view { sidenav_visible } = let visibility = class <| if sidenav_visible then "ca__sidenav--open" else "" in
  div [ class "ca__sidenav", visibility ]
    [ a (navigateTo Routing.dashboardPath) [text "Dashboard"]
    , a (navigateTo Routing.inventoryPath) [text "Inventory"]
    , a (navigateTo Routing.pricingPath) [text "Pricing"]
    , a (navigateTo Routing.conventionsPath) [text "Conventions"]
    , a doSignOut [text "Sign Out"] ]
