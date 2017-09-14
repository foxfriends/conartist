module Card exposing (card, cardWithHeader)
import Html exposing (Html, div, button, text, span)
import Html.Attributes exposing (class)

card : String -> List (Html.Attribute msg) -> List (Html msg) -> List (Html msg) -> Html msg
card title = cardWithHeader [ text title ]

cardWithHeader : List (Html msg) -> List (Html.Attribute msg) -> List (Html msg) -> List (Html msg) -> Html msg
cardWithHeader header attrs contents actions =
  div ([ class "card" ] ++ attrs)
    [ div [ class "card__title" ] header
    , div [ class "card__content" ] contents
    , div [ class "card__actions" ] actions ]
