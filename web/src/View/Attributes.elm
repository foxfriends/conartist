module View.Attributes exposing (onInteract, onEnter)
import Html
import Html.Events exposing (onClick, on, keyCode)
import Json.Decode as Decode

ifEnter : msg -> msg -> Int -> msg
ifEnter msg ignore key = if key == 13 then msg else ignore

onEnter : msg -> msg -> Html.Attribute msg
onEnter msg ignore =
  on "keydown" (Decode.map (ifEnter msg ignore) keyCode)

onInteract : msg -> msg -> List (Html.Attribute msg)
onInteract msg ignore =
  [ onClick msg
  , onEnter msg ignore ]
