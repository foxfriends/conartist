module Chart exposing (..)
import Html exposing (Html, div)
import Svg.Attributes exposing (..)
import Plot exposing (..)

-- TODO: stacked bars, for better inventory chart
bars : List (Html.Attribute msg) -> List String -> List (String, List Float) -> Html msg
bars attrs colors data =
  div attrs
    [ viewBars
        (Bars
          normalAxis
          (List.map (uncurry group))
          (List.map (fill >> List.singleton) colors)
          (Percentage 75))
        data ]
