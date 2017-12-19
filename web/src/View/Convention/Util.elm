module View.Convention.Util exposing (dateRange, frequency)
import Dict exposing (Dict)
import Date exposing (Date)
import Model.Convention as Convention

dateRange : Date -> Date -> String
dateRange start end = (Convention.formatDate start) ++ "–" ++ (Convention.formatDate end)

frequency : comparable -> Dict comparable Int -> Dict comparable Int
frequency item acc = Dict.update item (Maybe.withDefault 0 >> (+) 1 >> Just) acc
