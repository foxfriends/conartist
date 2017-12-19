module View.Convention.Util exposing (dateRange, frequency, errorPage, placeholder, productTypeLabel, productCircle)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Dict exposing (Dict)
import Date exposing (Date)
import Hex

import Model.Convention as Convention
import Model.ProductType exposing (FullType)
import View.Fancy as Fancy

dateRange : Date -> Date -> String
dateRange start end = (Convention.formatDate start) ++ "–" ++ (Convention.formatDate end)

frequency : comparable -> Dict comparable Int -> Dict comparable Int
frequency item acc = Dict.update item (Maybe.withDefault 0 >> (+) 1 >> Just) acc

errorPage : Html msg
errorPage = placeholder "It seems something has gone wrong. Maybe you should reload."

placeholder : String -> Html msg
placeholder str = div [ class "convention__placeholder" ] [ text str ]

productTypeLabel : FullType -> Html msg
productTypeLabel { color, name } =
  div [ class "convention__product-type"]
    [ productCircle color name
    , text name ]

productCircle : Int -> String -> Html msg
productCircle color name =
  Fancy.letterCircle
    (String.cons '#' <| String.padLeft 6 '0' <| Hex.toString color)
    (String.left 1 name)
