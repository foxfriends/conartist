module VDialog exposing (view, backdrop)
import Html exposing (Html, div, button, text, span)
import Html.Attributes exposing (class, id, disabled)
import Html.Events exposing (onClick)

import Fancy exposing (ButtonStyle(..))
import Msg exposing (Msg(..))
import Dialog exposing (Dialog(..))
import Icon exposing (icon)

view : Dialog -> Html Msg
view dialog =
  case dialog of
    Closed inner -> div [ class "dialog--closed" ] (innerView inner)
    Loading inner -> div [ class "dialog--loading" ] (innerView inner)
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
      , actions [ cancel ] ]
    ChooseConvention cons pages page ->
      [ title [ class "dialog__title" ] [ text "Choose a convention" ]
      , content [ text <| "TODO (" ++ toString (List.length cons) ++ " conventions waiting)"] -- TODO
      , actions <| chooseConventionControls pages page ++ [ cancel ] ]
    _ -> [ text "" ]

title : List (Html.Attribute msg) -> List (Html msg) -> Html msg
title attrs = div (class "dialog__title" :: attrs)

content : List (Html msg) -> Html msg
content = div [ class "dialog__content" ]

actions : List (Html msg) -> Html msg
actions = div [ class "dialog__actions" ]

ok : Html Msg
ok = Fancy.button Flat "Ok" [ onClick CloseDialog, id "dialog-focus-target" ]

cancel : Html Msg
cancel = Fancy.button Flat "Cancel" [ onClick CloseDialog, id "dialog-focus-target" ]

chooseConventionControls : Int -> Int -> List (Html Msg)
chooseConventionControls pages page =
  let prev no = Fancy.button Icon "navigate_before" [ onClick (DialogPage -1), disabled no ] in
  let next no = Fancy.button Icon "navigate_next" [ onClick (DialogPage 1), disabled no ] in
    [ prev (page == 0), next (page == pages) ]
