module View.Chart.Inventory exposing (..)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Svg exposing (Svg)
import Svg.Attributes exposing (fill)
import Plot exposing (..)

import View.Chart.Settings as Settings
import Msg exposing (..)

-- TODO: stacked bars, for better inventory chart
view : Maybe Point -> List (Html.Attribute Msg) -> List String -> List (String, List Float) -> Html Msg
view hovering attrs colors data =
  div (class "chart" :: attrs)
    [ viewBarsCustom
      { defaultBarsPlotCustomizations
      | onHover = Just InventoryChartHover
      , hintContainer = flyingHintContainer normalHintContainerInner hovering }
      (Bars
        normalAxis
        (List.map (uncurry (barGroup hovering)))
        (List.map (fill >> List.singleton) colors)
        (Percentage 75))
      data
    , Settings.button InventoryChartShowSettings ]

barGroup : Maybe Point -> String -> List Float -> BarGroup
barGroup hovering label heights =
  { label = \x ->
      { position = x
      , view = viewLabel [] label }
  , verticalLine = onHovering (fullLine [ class "bar-chart__hint-line" ]) hovering
  , hint = onHovering (hint heights) hovering
  , bars = List.map (bar Nothing) heights
  }

hint : List Float -> Html Never
hint heights = case heights of
  owned :: left :: [] -> div []
    [ div [ class "bar-chart__hint--no-wrap" ] [ text "Sold: ", text <| toString (owned - left) ]
    , div [ class "bar-chart__hint--no-wrap" ] [ text "Have: ", text <| toString left ]]
  _ -> text ""

bar : Maybe (Svg Never) -> Float -> { label: Maybe (Svg Never), height: Float }
bar label height =
  { label = label
  , height = height }

-- NOTE: copied from internals of elm-plot

onHovering : a -> Maybe Point -> Float -> Maybe a
onHovering stuff hovering x =
    Maybe.andThen
        (\p ->
            if p.x == x then
                Just stuff
            else
                Nothing
        )
        hovering
