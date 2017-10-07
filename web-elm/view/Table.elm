module Table exposing (table, tableWithFooter, tableWithSpacing)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, style)

table : List (Html.Attribute msg) -> List String -> (a -> List (Html msg)) -> List a -> Html msg
table = tableWithFooter []

headerColumn : Html msg -> Html msg
headerColumn title = div [ class "table__cell--header" ] [ title ]

column : Html msg -> Html msg
column data = div [ class "table__cell" ] [ data ]

tableWithFooter : List (Html msg) -> List (Html.Attribute msg) -> List String -> (a -> List (Html msg)) -> List a -> Html msg
tableWithFooter footer attrs titles =
  tableWithSpacing (String.repeat (List.length titles) "1fr ") footer attrs (List.map text titles)

tableWithSpacing : String -> List (Html msg) -> List (Html.Attribute msg) -> List (Html msg) -> (a -> List (Html msg)) -> List a -> Html msg
tableWithSpacing spacing footerContents attrs columnHeaders columns data =
  div
    ([ class "table__container" ] ++ attrs)
    ( [ div
        [ class "table"
        , style [ ("grid-template-columns", spacing ) ] ]
        ( (List.map headerColumn columnHeaders) ++ List.map column (List.concatMap columns data) )
      ]
    ++ if List.isEmpty footerContents then [] else [ div [ class "table__footer" ] footerContents ] )
