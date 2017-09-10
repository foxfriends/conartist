module VDashboard exposing (view)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)

import Model exposing (Model)
import Msg exposing (Msg)

view : Model -> Html Msg
view _ = div [ class "dashboard" ] [ text "Dashboard!" ]
