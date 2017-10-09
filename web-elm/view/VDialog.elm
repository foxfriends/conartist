module VDialog exposing (view, backdrop)
import Html exposing (Html, div, button, text, span)
import Html.Attributes exposing (class, id, disabled)
import Html.Events exposing (onClick)

import Fancy exposing (ButtonStyle(..))
import Msg exposing (Msg(..))
import Dialog exposing (Dialog(..), ChooseConvention_)
import Icon exposing (icon)
import Table exposing (tableWithSpacing)
import Convention exposing (MetaConvention)
import Align exposing (centered)

view : Dialog -> Html Msg
view dialog =
  -- TODO: this getting ugly
  case dialog of
    Closed (ChooseConvention data) -> div [ class "dialog--wide dialog--closed" ] (innerView (ChooseConvention data))
    Closed inner -> div [ class "dialog--closed" ] (innerView inner)
    Loading (ChooseConvention data) -> div [ class "dialog--wide dialog--loading" ] (innerView (ChooseConvention data))
    Loading inner -> div [ class "dialog--loading" ] (innerView inner)
    None -> div [ class "dialog--empty" ] []
    ChooseConvention _ -> div [ class "dialog--wide" ] (innerView dialog)
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
    ChooseConvention data ->
      [ title [ class "dialog__title" ] [ text "Choose a convention" ]
      , content [ chooseConventionList data ] -- TODO
      , actions <| [ cancel ] ]
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
    [ prev (page == 0)
    , text <| toString (page + 1) ++ " of " ++ toString (pages + 1)
    , next (page == pages) ]

chooseConventionList : ChooseConvention_ -> Html Msg
chooseConventionList { cons, pages, page } =
  tableWithSpacing "1fr 1fr 1fr 70px" (chooseConventionControls pages page) [] [ text "Name", text "Code", text "Date", text "" ] conventionRow cons

conventionRow : MetaConvention -> List (Html Msg)
conventionRow con =
  let { name, code, start, end } = con in
    [ text name
    , span [ class "choose-convention__placeholder" ] [ text code ]
    , span [ class "choose-convention__date" ] [ text <| (Convention.formatDate start) ++ "–" ++ (Convention.formatDate end) ]
    , centered <| Fancy.button Icon "check" [ onClick <| Batch [AddConvention con, CloseDialog] ] ]
