module View.Attributes exposing (onInteract, onEnter, tabularFigures)
{-| Some helpers to apply common attributes to HTML elements

# Attributes
@docs tabularFigures

# Events
@docs onInteract, onEnter

-}
import Html
import Html.Attributes exposing (class)
import Html.Events exposing (onClick, on, keyCode)
import Json.Decode as Decode

ifEnter : msg -> msg -> Int -> msg
ifEnter msg ignore key = if key == 13 then msg else ignore

{-| Triggers the given message when the enter key is pressed while this element is focused.

    input [ _type "text", onEnter EnterPressed Ignore ]
-}
onEnter : msg -> msg -> Html.Attribute msg
onEnter msg ignore =
  on "keydown" (Decode.map (ifEnter msg ignore) keyCode)

{-| Triggers the given message whenever the user clicks on the element, or presses enter while the
element is focused.

    button [ onInteract ButtonPressed Ignore ]
-}
onInteract : msg -> msg -> List (Html.Attribute msg)
onInteract msg ignore =
  [ onClick msg
  , onEnter msg ignore ]

{-| Applies a class to this element to use tabular figures.

    span [ tabularFigures ] [ text "Hello 123" ]
-}
tabularFigures : Html.Attribute msg
tabularFigures = class "text--tabular"
