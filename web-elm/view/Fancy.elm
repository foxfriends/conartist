module Fancy exposing (..)

import Html exposing (Html, div, span, label, text)
import Html.Attributes exposing (class, type_, value)
import Html.Events exposing (onClick, onCheck)
import Icon exposing (icon)

input : String -> String -> List (Html.Attribute msg) -> List (Html.Attribute msg) -> Html msg
input placeholder val baseAttrs inputAttrs =
  let state = class <| if val == "" then "fancy-input--empty" else "" in
  div
    ( [ class "fancy-input", state ] ++ baseAttrs )
    [ Html.input ([ class "fancy-input__field", value val ] ++ inputAttrs) []
    , span [ class "fancy-input__placeholder" ] [ text placeholder ]
    , div [ class "fancy-input__underline" ]
      [ div [ class "fancy-input__underline--secondary" ] []
      , div [ class "fancy-input__underline--primary" ] []
      , div [ class "fancy-input__underline--warn" ] [] ] ]

checkbox : (Bool -> msg) -> String -> Html msg
checkbox msg labelText =
  label [ class "fancy-check"]
    [ Html.input [ type_ "checkbox", class "fancy-check__box", onCheck msg ] []
    , span [ class "fancy-check__label"] [ text labelText ] ]

button : ButtonStyle -> String -> List (Html.Attribute msg) -> Html msg
button bstyle buttonText =
  let content = case bstyle of
    Icon -> icon buttonText []
    _    -> text buttonText
  in buttonWithContent bstyle [ content ]

buttonWithContent : ButtonStyle -> List (Html msg) -> List (Html.Attribute msg) -> Html msg
buttonWithContent bstyle content attrs =
  let style = case bstyle of
    Primary -> "fancy-button--primary"
    Flat -> "fancy-button--flat"
    Icon -> "fancy-button--icon"
  in Html.button ([ class "fancy-button", class style ] ++ attrs) content

type ButtonStyle
  = Primary
  | Flat
  | Icon
