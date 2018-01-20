module View.Table exposing
  ( table
  , tableHeader
  , tableRow
  , tableWithFooter
  , tableWithSpacing
  , basicSortableTable
  , sortableTable
  , summarizedTable
  , updateSort
  , cellLiner
  , TableHeader(..)
  )
import Html exposing (Html, div, text)
import Html.Events exposing (onClick)
import Html.Attributes exposing (class, style)
import Util.List exposing (zip)

cellLiner : Html.Attribute msg
cellLiner = class "table__cell-liner"


type TableHeader a msg
  = Sortable String (a -> a -> Order) (Int -> msg)
  | Standard String
  | Html (Html msg)

headerColumn : Order -> Int -> TableHeader a msg -> Html msg
headerColumn sort index title = div [ class "table__cell--header" ]
  [ case title of
      Standard title -> text title
      Sortable title _ onSort ->
        let dir = case sort of
          EQ -> ""
          LT -> "--asc"
          GT -> "--desc"
        in div [ class <| "table__sort" ++ dir, onClick (onSort index) ] [ text title ]
      Html html -> html ]

column : Html msg -> Html msg
column data = div [ class "table__cell" ] [ data ]

summaryColumn : Html msg -> Html msg
summaryColumn data = div [ class "table__cell--summary" ] [ data ]

tableHeader : List String -> Html msg
tableHeader titles =
  let spacing = (String.repeat (List.length titles) "1fr ") in
  div
    [ class "table", style [ ("grid-template-columns", spacing ) ] ]
    (List.map (headerColumn EQ 0 << Standard) titles)

tableRow : (a -> List (Html msg)) -> a -> Html msg
tableRow fn data =
  let result = List.map column <| fn data
      spacing = (String.repeat (List.length result) "1fr ") in
    div
      [ class "table", style [ ("grid-template-columns", spacing ) ] ]
      result

defaultSpacing : Int -> String
defaultSpacing = flip String.repeat "1fr "

table : List (Html.Attribute msg) -> List String -> (a -> List (Html msg)) -> List a -> Html msg
table = tableWithFooter []

tableWithFooter
    : List (Html msg)
    -> List (Html.Attribute msg)
    -> List String
    -> (a -> List (Html msg))
    -> List a
    -> Html msg
tableWithFooter footer attrs titles =
  tableWithSpacing (defaultSpacing (List.length titles)) footer attrs (List.map Standard titles)

tableWithSpacing
    : String
    -> List (Html msg)
    -> List (Html.Attribute msg)
    -> List (TableHeader a msg)
    -> (a -> List (Html msg))
    -> List a
    -> Html msg
tableWithSpacing spacing footer attrs headers =
  summarizedTable
    Nothing
    (always <| always (Nothing, []))
    (List.map (always EQ) headers)
    spacing
    footer
    attrs
    headers

basicSortableTable
    : List Order
    -> List (Html.Attribute msg)
    -> List (TableHeader a msg)
    -> (a -> List (Html msg))
    -> List a
    -> Html msg
basicSortableTable sort attrs headers = sortableTable sort (defaultSpacing (List.length headers)) [] attrs headers

sortableTable
    : List Order
    -> String
    -> List (Html msg)
    -> List (Html.Attribute msg)
    -> List (TableHeader a msg)
    -> (a -> List (Html msg))
    -> List a
    -> Html msg
sortableTable = summarizedTable Nothing (always <| always (Nothing, []))

summarizedTable
    : b
    -> (b -> Maybe a -> (b, List (Html msg)))
    -> List Order
    -> String
    -> List (Html msg)
    -> List (Html.Attribute msg)
    -> List (TableHeader a msg)
    -> (a -> List (Html msg))
    -> List a
    -> Html msg
summarizedTable = customTable

customTable
    : b
    -> (b -> Maybe a -> (b, List (Html msg)))
    -> List Order
    -> String
    -> List (Html msg)
    -> List (Html.Attribute msg)
    -> List (TableHeader a msg)
    -> (a -> List (Html msg))
    -> List a
    -> Html msg
customTable init summarizer sortStatus spacing footerContents attrs columnHeaders columns data =
  let
    headers =
      columnHeaders
        |> zip sortStatus
        |> List.indexedMap (\i -> \(o, h) -> headerColumn o i h)
    cells =
      data
        |> List.sortWith (sortFn sortStatus columnHeaders)
        |> List.foldl (\a -> \(acc, values) ->
            let
              (newacc, summary) = summarizer acc (Just a)
            in
              (newacc, values ++ (List.map summaryColumn summary) ++ List.map column (columns a))
          ) (init, [])
        |> Tuple.mapFirst (flip summarizer Nothing >> Tuple.second)
        |> (\(f, r) -> r ++ List.map summaryColumn f)
  in
    div
      ([ class "table__container" ] ++ attrs)
      <|  [ div
            [ class "table"
            , style [ ("grid-template-columns", spacing ) ] ]
            ( headers ++ cells ) ]
          ++ if List.isEmpty footerContents then [] else [ div [ class "table__footer" ] footerContents ]

sortFor : TableHeader a msg -> (a -> a -> Order)
sortFor header = case header of
  Sortable _ sort _ -> sort
  _ -> always <| always EQ

adjustSort : Order -> (a -> a -> Order) -> (a -> a -> Order)
adjustSort order sort =
  case order of
    LT -> sort
    EQ -> always <| always EQ
    GT -> (\x -> \y -> case sort x y of
      LT -> GT
      GT -> LT
      EQ -> EQ)

sortFn : List Order -> List (TableHeader a msg) -> (a -> a -> Order)
sortFn orders headers =
  zip orders headers
    |> List.filter (Tuple.first >> (==) EQ >> not)
    |> List.head
    |> Maybe.map (Tuple.mapSecond sortFor)
    |> Maybe.map (uncurry adjustSort)
    |> Maybe.withDefault (always <| always EQ)

updateSort : Int -> List Order -> List Order
updateSort col list = case list of
  [] -> []
  head :: tail ->
    case col of
      0 -> (case head of
        EQ -> LT
        LT -> GT
        GT -> EQ) :: List.map (always EQ) tail
      n -> EQ :: updateSort (col - 1) tail
