module Table exposing (table)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, style)

table : List String -> (a -> List (Html msg)) -> List a -> Html msg
table columnHeaders columns data =
  div
    [ class "table"
    , style [ ("grid-template-columns", String.repeat 4 "1fr ") ] ]
    ((List.map headerColumn columnHeaders) ++ List.map column (List.concatMap columns data))

headerColumn : String -> Html msg
headerColumn title = div [ class "table__cell--header" ] [ text title ]

column : Html msg -> Html msg
column data = div [ class "table__cell" ] [ data ]
