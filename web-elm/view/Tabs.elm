module Tabs exposing (tabs)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Html.Keyed as K

tabs : (Int -> msg) -> List (Html.Attribute msg) -> List (String, Html msg) -> Int -> Html msg
tabs onSwitch attrs contents current =
  div ([ class "tabs" ] ++ attrs)
    [ K.node "div" [ class "tabs__titles" ]
      ( List.indexedMap
        (\i -> \(t, _) ->
          ( toString i
          , div [ class "tabs__title", onClick (onSwitch i) ] [ text t ] ) )
        contents )
    , K.node "div" [ class "tabs__contents" ]
      ( List.indexedMap
        (\i -> \(_, c) -> let position = class <|
            if i < current then "tabs__content--positive"
            else if i > current then "tabs__content--negative"
            else "tabs__content--current"
          in
          ( toString i
          , div [ class "tabs__content", position ] [ c ] ) )
        contents ) ]
