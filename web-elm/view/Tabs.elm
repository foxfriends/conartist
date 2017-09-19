module Tabs exposing (tabs)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Html.Keyed as K

tabs : (Int -> msg) -> List (Html.Attribute msg) -> List (String, Html msg) -> Int -> Html msg
tabs onSwitch attrs contents current =
  let position = \i ->
    if i < current then "positive"
    else if i > current then "negative"
    else "current"
  in
    div ([ class "tabs" ] ++ attrs)
      [ K.node "div" [ class "tabs__titles" ]
        ( ( List.indexedMap
            (\i -> \(t, _) ->
              ( toString i
              , div [ class <| "tabs__title tabs__title--" ++ (position i), onClick (onSwitch i) ] [ text t ] ) )
            contents )
        ++ [ ("__indicator__", div [ class "tabs__indicator"] []) ])
      , K.node "div" [ class "tabs__contents" ]
        ( List.indexedMap
          (\i -> \(_, c) ->
            ( toString i
            , div [ class <| "tabs__content tabs__content--" ++ (position i) ] [ c ] ) )
          contents ) ]
