module View.Chart.Settings exposing (view, button)
import Html exposing (Html, div)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

import Model.Model exposing (Model)
import Model.Page exposing (ConventionPageState)
import View.Fancy as Fancy exposing (ButtonStyle(..))
import Msg exposing (Msg(..))

button : msg -> Html msg
button click =
  Fancy.button Icon "settings" [ class "chart__settings-button", onClick click ]

view : Model -> ConventionPageState -> Html Msg
view model page = div [] []
