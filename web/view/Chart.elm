module Chart exposing (..)
import Html exposing (Html, div)
import Svg.Attributes exposing (..)
import Plot exposing (..)

-- TODO: stacked bars, for better inventory chart
bars : List (Html.Attribute msg) -> List String -> List (String, List Float) -> Html msg
bars = rawBars Nothing Nothing

barsWithHover : (Maybe Point -> msg) -> Maybe Point -> List (Html.Attribute msg) -> List String -> List (String, List Float) -> Html msg
barsWithHover = Just >> rawBars

rawBars : Maybe (Maybe Point -> msg) -> Maybe Point -> List (Html.Attribute msg) -> List String -> List (String, List Float) -> Html msg
rawBars onHover hovering attrs colors data =
  div attrs
    [ viewBarsCustom
      { defaultBarsPlotCustomizations
      | onHover = onHover
      , hintContainer = flyingHintContainer normalHintContainerInner hovering }
      (Bars
        normalAxis
        (List.map (uncurry (hintGroup hovering)))
        (List.map (fill >> List.singleton) colors)
        (Percentage 75))
      data ]
