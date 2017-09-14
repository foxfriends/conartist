module Table exposing (table)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)

table : List String -> (a -> List (Html msg)) -> List a -> Html msg
table columnHeaders rowOfColumns data =
  div [ class "table" ]
    ( div [ class "table__row--header" ] (List.map headerColumn columnHeaders)
   :: List.map (rowOfColumns >> row) data )

headerColumn : String -> Html msg
headerColumn title = div [ class "table__column--header" ] [ text title ]

row : List (Html msg) -> Html msg
row columns =
  div [ class "table__row" ] <| List.map column columns

column : Html msg -> Html msg
column data = div [ class "table__column" ] [ data ]
