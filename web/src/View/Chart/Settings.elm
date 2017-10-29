module View.Chart.Settings exposing (button)
import Html exposing (Html)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

import View.Fancy as Fancy exposing (ButtonStyle(..))

button : msg -> Html msg
button click =
  Fancy.button Icon "settings" [ class "chart__settings-button", onClick click ]
