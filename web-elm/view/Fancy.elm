module Fancy exposing (..)

import Html exposing (Html, div, span, label, text)
import Html.Attributes exposing (class, type_)
import Html.Events exposing (onClick)
import Icon exposing (icon)

input : String -> String -> List (Html.Attribute msg) -> List (Html.Attribute msg) -> Html msg
input placeholder value baseAttrs inputAttrs =
  let state = class <| if value == "" then "fancy-input--empty" else "" in
  div
    ( [ class "fancy-input", state ] ++ baseAttrs )
    [ Html.input ([ class "fancy-input__field" ] ++ inputAttrs) []
    , span [ class "fancy-input__placeholder" ] [ text placeholder ]
    , div [ class "fancy-input__underline" ]
      [ div [ class "fancy-input__underline--secondary" ] []
      , div [ class "fancy-input__underline--primary" ] []
      , div [ class "fancy-input__underline--warn" ] [] ] ]

checkbox : msg -> String -> Html msg
checkbox msg labelText =
  label [ class "fancy-check"]
    [ Html.input [ type_ "checkbox", class "fancy-check__box", onClick msg ] []
    , span [ class "fancy-check__label"] [ text labelText ] ]

button : ButtonStyle -> String -> List (Html.Attribute msg) -> Html msg
button bstyle buttonText attrs =
  let style = case bstyle of
    Primary -> "fancy-button--primary"
    Flat -> "fancy-button--flat"
    Icon -> "fancy-button--icon"
  in let content = case bstyle of
    Icon -> icon buttonText
    _    -> text buttonText
  in Html.button ([ class "fancy-button", class style ] ++ attrs) [ content ]

type ButtonStyle
  = Primary
  | Flat
  | Icon
