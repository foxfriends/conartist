module Card exposing (card)
import Html exposing (Html, div, button, text, span)
import Html.Attributes exposing (class)

card : String -> List (Html.Attribute msg) -> List (Html msg) -> List (Html msg) -> Html msg
card title attrs contents actions =
  div ([ class "card" ] ++ attrs)
    [ div [ class "card__title" ] [ text title ]
    , div [ class "card__content" ] contents
    , div [ class "card__actions" ] actions ]
