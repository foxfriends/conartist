module Chart exposing (..)
import Html exposing (Html, div)
-- import Svg exposing (Svg)
import Svg.Attributes exposing (..)
import Plot exposing (..)
import Mouse exposing (Position)

-- TODO: stacked bars, for better inventory chart
bars : List (Html.Attribute msg) -> List String -> List (String, List Float) -> Html msg
bars = rawBars Nothing

barsWithHover : Position -> List (Html.Attribute msg) -> List String -> List (String, List Float) -> Html msg
barsWithHover = Just >> rawBars

rawBars : Maybe Position -> List (Html.Attribute msg) -> List String -> List (String, List Float) -> Html msg
rawBars hovering attrs colors data =
  div attrs
    [ viewBarsCustom
      { defaultBarsPlotCustomizations
      | hintContainer = flyingHintContainer normalHintContainerInner (Maybe.map asPoint hovering) }
      (Bars
        normalAxis
        (List.map (uncurry (hintGroup (Maybe.map asPoint hovering))))
        (List.map (fill >> List.singleton) colors)
        (Percentage 75))
      data ]

asPoint : Position -> Point
asPoint { x, y } = { x = toFloat x, y = toFloat y }
