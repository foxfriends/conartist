module Tabs exposing (tabs, tabsWithFooter, TabItem(..), TabStatus)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, style)
import Html.Events exposing (onClick, on)
import Html.Keyed as K
import Json.Decode as Decode
import DOM exposing (target, offsetLeft, offsetWidth)

import Icon exposing (icon)
import Fancy

type TabItem msg
  = Tab String (Html msg)
  | Button String msg
  | IconButton String msg

type alias TabStatus =
  { current: Int
  , width: Float }

tabs : (TabStatus -> msg) -> List (Html.Attribute msg) -> List (TabItem msg) -> TabStatus -> Html msg
tabs = tabsWithFooter []

tabsWithFooter : List (Html msg) -> (TabStatus -> msg) -> List (Html.Attribute msg) -> List (TabItem msg) -> TabStatus -> Html msg
tabsWithFooter footerContents onSwitch attrs contents { current, width } =
  let position = \i ->
    if i < current then "positive"
    else if i > current then "negative"
    else "current"
  in
    div ([ class "tabs" ] ++ attrs)
      [ K.node "div" [ class "tabs__titles" ]
        ( ( List.indexedMap
            (\i -> \c -> case c of
              Tab t _ ->
                ( toString i
                , div
                  [ class "tabs__title"
                  , on "click" (Decode.map onSwitch <| Decode.map (TabStatus i) (target offsetWidth)) ]
                  [ text t ] )
              Button t msg ->
                ( toString i
                , div [ class "tabs__title", onClick msg ] [ text t ] )
              IconButton t msg ->
                ( toString i
                , div [ class "tabs__title", onClick msg ] [ icon t [] ] ) )
            contents )
        ++ [( "__indicator__"
            , div
              [ class "tabs__indicator"
              , style
                [ ( "transform"
                  , "translateX(" ++ toString (width * toFloat current + width / 2) ++ "px) scaleX(" ++ toString width ++ ")" ) ] ] []) ])
      , K.node "div" [ class "tabs__contents" ]
        ( List.indexedMap
          (\i -> \c -> case c of
              Tab _ c ->
                ( toString i
                , div [ class <| "tabs__content tabs__content--" ++ (position i) ] [ c ] )
              _ -> (toString i, div [ class <| "tabs__content tabs__content--false tabs__content--" ++ (position i) ] []) )
          contents )
      , div [ class "tabs__footer" ] footerContents ]
