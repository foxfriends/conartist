module Chart exposing (..)
import Html exposing (Html)
import Svg.Attributes exposing (..)
import Plot exposing (..)

bars : List String -> List (String, List Float) -> Html msg
bars colors =
  viewBars
    (Bars
      normalAxis
      (List.map (uncurry group))
      [ List.map fill colors ]
      (Percentage 75))
