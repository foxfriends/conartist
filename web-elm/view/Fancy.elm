module Fancy exposing (..)

import Html exposing (Html, div, span, label, text)
import Html.Attributes exposing (class, type_, value)
import Html.Events exposing (onClick, onCheck)
import Icon exposing (icon)

input : String -> String -> List (Html.Attribute msg) -> List (Html.Attribute msg) -> Html msg
input = labelledInput (text "")

iconLabel : String -> Html msg
iconLabel name =
  icon name [ class "fancy-input__label" ]

labelledInput : Html msg -> String -> String -> List (Html.Attribute msg) -> List (Html.Attribute msg) -> Html msg
labelledInput fieldLabel placeholder val baseAttrs inputAttrs =
  let state = class <| if val == "" then "fancy-input--empty" else "" in
  label
    ( [ class "fancy-input", state ] ++ baseAttrs )
    [ fieldLabel
    , Html.input ([ class "fancy-input__field", value val ] ++ inputAttrs) []
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
    FAB  -> icon buttonText []
    _    -> text buttonText
  in buttonWithContent bstyle [ content ]

buttonWithContent : ButtonStyle -> List (Html msg) -> List (Html.Attribute msg) -> Html msg
buttonWithContent bstyle content attrs =
  let style = case bstyle of
    Primary -> "fancy-button--primary"
    Flat -> "fancy-button--flat"
    Icon -> "fancy-button--icon"
    FAB -> "fancy-button--fab"
  in Html.button ([ class style ] ++ attrs) content

type ButtonStyle
  = Primary
  | Flat
  | Icon
  | FAB

select : a -> List a -> (a -> String) -> (a -> msg) -> Html msg
select value options nameOf onSelect =
  Html.div [ class "fancy-select"] <| List.map (option nameOf) options

option : (a -> String) -> a -> Html msg
option name opt =
  Html.div [ class "fancy-select__option" ] [ text <| name opt ]

menu : List (Html.Attribute msg) -> Html msg -> Html msg -> msg -> Bool -> Html msg
menu attrs anchor contents toClose open =
  div
    ( class "fancy-menu" :: attrs )
    [ div [ class <| "fancy-menu__backdrop--" ++ if open then "open" else "closed", onClick toClose ] [ ]
    , div [ class "fancy-menu__anchor" ] [ anchor ]
    , div [ class <| "fancy-menu__contents--" ++ if open then "open" else "closed" ] [ contents ] ]
