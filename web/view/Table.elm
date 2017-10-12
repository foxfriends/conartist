module Table exposing (table, tableWithFooter, tableWithSpacing, tableHeader, tableRow, TableHeader(..))
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, style)

type TableHeader a msg
  = Sortable String (a -> a -> Order)
  | Standard String
  | Html (Html msg)

table : List (Html.Attribute msg) -> List String -> (a -> List (Html msg)) -> List a -> Html msg
table = tableWithFooter []

headerColumn : TableHeader a msg -> Html msg
headerColumn title = div [ class "table__cell--header" ]
  [ case title of
      Standard title -> text title
      Sortable title sort -> text title
      Html html -> html ]

column : Html msg -> Html msg
column data = div [ class "table__cell" ] [ data ]

tableWithFooter : List (Html msg) -> List (Html.Attribute msg) -> List String -> (a -> List (Html msg)) -> List a -> Html msg
tableWithFooter footer attrs titles =
  tableWithSpacing (String.repeat (List.length titles) "1fr ") footer attrs (List.map Standard titles)

tableWithSpacing : String -> List (Html msg) -> List (Html.Attribute msg) -> List (TableHeader a msg) -> (a -> List (Html msg)) -> List a -> Html msg
tableWithSpacing = customTable

tableHeader : List String -> Html msg
tableHeader titles =
  let spacing = (String.repeat (List.length titles) "1fr ") in
  div
    [ class "table", style [ ("grid-template-columns", spacing ) ] ]
    (List.map (headerColumn << Standard) titles)

tableRow : (a -> List (Html msg)) -> a -> Html msg
tableRow fn data =
  let result = List.map column <| fn data in
  let spacing = (String.repeat (List.length result) "1fr ") in
    div
      [ class "table", style [ ("grid-template-columns", spacing ) ] ]
      result

customTable : String -> List (Html msg) -> List (Html.Attribute msg) -> List (TableHeader a msg) -> (a -> List (Html msg)) -> List a -> Html msg
customTable spacing footerContents attrs columnHeaders columns data =
  div
    ([ class "table__container" ] ++ attrs)
    ( [ div
        [ class "table"
        , style [ ("grid-template-columns", spacing ) ] ]
        ( (List.map headerColumn columnHeaders) ++ List.map column (List.concatMap columns data) )
      ]
    ++ if List.isEmpty footerContents then [] else [ div [ class "table__footer" ] footerContents ] )
