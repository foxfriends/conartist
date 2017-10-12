module Fancy exposing (..)

import Html exposing (Html, div, span, label, text)
import Html.Attributes exposing (class, type_, value, tabindex, style)
import Html.Events exposing (onClick, onCheck)
import Icon exposing (icon)

flush : Html.Attribute msg
flush = class "fancy-input--flush"

type TooltipAlignment
  = Left
  | Center
  | Right
  | Below

alignedTooltip : TooltipAlignment -> String -> Html msg -> Html msg
alignedTooltip alignment content element =
  let alignmentStyle = case alignment of
    Left    -> "left"
    Right   -> "right"
    Center  -> "center"
    Below   -> "below"
  in
    div [ class "fancy-tooltip" ]
      [ div [ class "fancy-tooltip__element" ] [ element ]
      , div [ class <| "fancy-tooltip__text--" ++ alignmentStyle ] [ text content ] ]

tooltip : String -> Html msg -> Html msg
tooltip = alignedTooltip Center

-- TODO: formatted input
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

-- TODO: make this look cool
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
    Flat    -> "fancy-button--flat"
    Icon    -> "fancy-button--icon"
    FAB     -> "fancy-button--fab"
  in Html.button ([ class style ] ++ attrs) content

-- TODO: multi-state buttons
type ButtonStyle
  = Primary
  | Flat
  | Icon
  | FAB

optionalSelect : msg -> (Maybe a -> msg) -> (Maybe a -> String) -> List (Maybe a) -> Maybe a -> Bool -> Html msg
optionalSelect onOpen onSelect nameOf options value open =
  let optionHtml = List.map (\o -> option onSelect (nameOf o) o (o == value)) options
  in rawSelect onOpen onSelect optionHtml value (nameOf value) open

select : msg -> (Maybe a -> msg) -> (Maybe a -> String) -> List a -> Maybe a -> Bool -> Html msg
select onOpen onSelect nameOf options value open =
  let optionHtml = List.map (\o -> option onSelect (nameOf (Just o)) (Just o) (Just o == value)) options
  in rawSelect onOpen onSelect optionHtml value (nameOf value) open

-- TODO: keyboard controls for select (hover state, select on <Enter>)
rawSelect : msg -> (Maybe a -> msg) -> List (Html msg) -> Maybe a -> String -> Bool -> Html msg
rawSelect onOpen onSelect optionHtml value display open =
  let suffix = if open then "--open" else "--closed" in
  div
    ( class "fancy-select" :: (if open then [] else [ onClick onOpen, tabindex 0 ]) )
    [ div [ class <| "fancy-select__backdrop" ++ suffix, onClick (onSelect Nothing) ] []
    , div [ class <| "fancy-select__value" ++ (if value == Nothing then "--default" else "") ] [ text display ]
    , div [ class <| "fancy-select__options" ++ suffix ] optionHtml ]

option : (Maybe a -> msg) -> String -> Maybe a -> Bool -> Html msg
option onSelect name opt isSelected =
  div [ class "fancy-select__option", onClick (onSelect opt) ] [ text name, if isSelected then icon "check" [ class "fancy-select__selected" ] else text "" ]

-- TODO: keyboard controls for menu (hover state, select on <Enter>)
menu : List (Html.Attribute msg) -> Html msg -> Html msg -> msg -> Bool -> Html msg
menu attrs anchor contents toClose open =
  div
    ( class "fancy-menu" :: attrs )
    [ div [ class <| "fancy-menu__backdrop--" ++ if open then "open" else "closed", onClick toClose ] [ ]
    , div [ class "fancy-menu__anchor" ] [ anchor ]
    , div [ class <| "fancy-menu__contents--" ++ if open then "open" else "closed" ] [ contents ] ]

letterCircle : String -> String -> Html msg
letterCircle color char = span [ class "fancy-letter--circle", style [( "background-color", color )] ] [ text char ]
