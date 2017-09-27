module Tabs exposing (tabs, TabItem(..))
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Html.Keyed as K

import Icon exposing (icon)

type TabItem msg
  = Tab(String, Html msg)
  | Button(String, msg)

tabs : (Int -> msg) -> List (Html.Attribute msg) -> List (TabItem msg) -> Int -> Html msg
tabs onSwitch attrs contents current =
  let position = \i ->
    if i < current then "positive"
    else if i > current then "negative"
    else "current"
  in
    div ([ class "tabs" ] ++ attrs)
      [ K.node "div" [ class "tabs__titles" ]
        ( ( List.indexedMap
            (\i -> \c -> case c of
              Tab(t, _) ->
                ( toString i
                , div [ class <| "tabs__title tabs__title--" ++ (position i), onClick (onSwitch i) ] [ text t ] )
              Button(t, msg) ->
                ( toString i
                , div [ class <| "tabs__title tabs__title--" ++ (position i), onClick msg ] [ icon t [] ] ) )
            contents )
        ++ [ ("__indicator__", div [ class "tabs__indicator"] []) ])
      , K.node "div" [ class "tabs__contents" ]
        ( List.indexedMap
          (\i -> \c -> case c of
              Tab(_, c) ->
                ( toString i
                , div [ class <| "tabs__content tabs__content--" ++ (position i) ] [ c ] )
              Button(_) -> (toString i, div [ class <| "tabs__content tabs__content--false tabs__content--" ++ (position i) ] []) )
          contents ) ]
