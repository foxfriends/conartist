module FancyInput exposing (fancyInput)

import Html exposing (Html, input, div)
import Html.Attributes exposing (class)

fancyInput : List (Html.Attribute msg) -> List (Html.Attribute msg) -> Html msg
fancyInput baseAttrs inputAttrs =
  div
    ( [ class "fancy-input" ] ++ baseAttrs )
    [ input ([ class "fancy-input__field" ] ++ inputAttrs) []
    , div [ class "fancy-input__underline" ]
      [ div [ class "fancy-input__underline--secondary" ] []
      , div [ class "fancy-input__underline--primary" ] [] ] ]
