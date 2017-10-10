module Tabs exposing (tabs, tabsWithFooter, TabItem(..))
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, style, tabindex)
import Html.Events exposing (onClick, on)
import Html.Keyed as K
import Json.Decode as Decode
import DOM exposing (target, offsetLeft, offsetWidth)

import Msg exposing (Msg(..), TabStatus)
import Icon exposing (icon)
import Attributes exposing (onInteract, onEnter)

type TabItem msg
  = Tab String (Html msg)
  | Button String msg
  | IconButton String msg

tabs : (TabStatus -> Msg) -> List (Html.Attribute Msg) -> List (TabItem Msg) -> TabStatus -> Html Msg
tabs = tabsWithFooter []

tabsWithFooter : List (Html Msg) -> (TabStatus -> Msg) -> List (Html.Attribute Msg) -> List (TabItem Msg) -> TabStatus -> Html Msg
tabsWithFooter footerContents onSwitch attrs contents { current, width } =
  let position i =
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
                  -- TODO: is this actually needed?
                  , on "click" (Decode.map onSwitch <| Decode.map (TabStatus i) (target offsetWidth))
                  , onEnter (onSwitch (TabStatus i width)) Ignore
                  , tabindex 0 ]
                  [ text t ] )
              Button t msg ->
                ( toString i
                , div ([ class "tabs__title", tabindex 0 ] ++ (onInteract msg Ignore)) [ text t ] )
              IconButton t msg ->
                ( toString i
                , div ([ class "tabs__title", tabindex 0 ] ++ (onInteract msg Ignore)) [ icon t [] ] ) )
            contents )
        ++ [( "__indicator__"
            , div
              [ class "tabs__indicator"
              , style
                [ ( "transform"
                  -- so idk why there's a -1 but it is off by 1
                  , "translateX(" ++ toString (width * toFloat current + width / 2 - 1) ++ "px) scaleX(" ++ toString width ++ ")" ) ] ] []) ])
      , K.node "div" [ class "tabs__contents" ]
        ( List.indexedMap
          (\i -> \c -> case c of
              Tab _ c ->
                ( toString i
                , div [ class <| "tabs__content tabs__content--" ++ (position i) ] [ c ] )
              _ -> (toString i, div [ class <| "tabs__content tabs__content--false tabs__content--" ++ (position i) ] []) )
          contents )
      , div [ class "tabs__footer" ] footerContents ]
