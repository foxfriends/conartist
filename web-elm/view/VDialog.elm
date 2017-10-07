module VDialog exposing (view, backdrop)
import Html exposing (Html, div, button, text, span)
import Html.Attributes exposing (class, id)
import Html.Events exposing (onClick)

import Fancy exposing (ButtonStyle(..))
import Msg exposing (Msg(..))
import Dialog exposing (Dialog(..))
import Icon exposing (icon)

view : Dialog -> Html Msg
view dialog =
  case dialog of
    Closed inner -> div [ class "dialog--closed" ] (innerView inner)
    None -> div [ class "dialog--empty" ] []
    _ -> div [ class "dialog" ] (innerView dialog)

backdrop : Dialog -> Html msg
backdrop dialog =
  case dialog of
    Closed _ -> div [ class "dialog__backdrop" ] []
    None -> div [ class "dialog__backdrop" ] []
    _ -> div [ class "dialog__backdrop--open" ] []

innerView : Dialog -> List (Html Msg)
innerView dialog =
  case dialog of
    Error msg ->
      [ title [ class "dialog__title--warn" ] [ icon "error" [ class "dialog__title-icon" ], text "Oh no" ]
      , content [ text msg ]
      , actions [ close ] ]
    ChooseConvention -> []
    _ -> [ text "" ]

title : List (Html.Attribute msg) -> List (Html msg) -> Html msg
title attrs = div (class "dialog__title" :: attrs)

content : List (Html msg) -> Html msg
content = div [ class "dialog__content" ]

actions : List (Html msg) -> Html msg
actions = div [ class "dialog__actions" ]

close : Html Msg
close = Fancy.button Flat "Ok" [ onClick CloseDialog, id "dialog-focus-target" ]
