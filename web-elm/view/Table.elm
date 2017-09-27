module Table exposing (table, tableWithFooter)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, style)

table : List String -> (a -> List (Html msg)) -> List a -> Html msg
table = tableWithFooter []

headerColumn : String -> Html msg
headerColumn title = div [ class "table__cell--header" ] [ text title ]

column : Html msg -> Html msg
column data = div [ class "table__cell" ] [ data ]

tableWithFooter : List (Html msg) -> List String -> (a -> List (Html msg)) -> List a -> Html msg
tableWithFooter footerContents columnHeaders columns data =
  div
    [ class "table__container" ]
    ( [ div
        [ class "table"
        , style [ ("grid-template-columns", String.repeat (List.length columnHeaders) "1fr ") ] ]
        ( (List.map headerColumn columnHeaders) ++ List.map column (List.concatMap columns data) )
      ]
    ++ if List.isEmpty footerContents then [] else [ div [ class "table__footer" ] footerContents ] )
