module VSidenav exposing (view)

import Html exposing (Html, div, a, text)
import Html.Attributes exposing (class, href)

import Model exposing (Model)
import Msg exposing (Msg)

view : Model -> Html Msg
view _ = div [ class "ca__sidenav" ]
  [ a [] [text "Dashboard"]
  , a [] [text "Inventory"]
  , a [] [text "Pricing"]
  , a [] [text "Conventions"]
  , a [] [text "Sign Out"] ]
