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
import Model exposing (Model)

view : Model -> Dialog -> Html Msg
view model dialog =
  -- TODO: this getting ugly
  case dialog of
    Closed (ChooseConvention data) -> div [ class "dialog--wide dialog--closed" ] (innerView model (ChooseConvention data))
    Closed inner -> div [ class "dialog--closed" ] (innerView model inner)
    ChooseConvention _ -> div [ class "dialog--wide" ] (innerView model dialog)
    None -> div [ class "dialog--empty" ] []
    _ -> div [ class "dialog" ] (innerView model dialog)

backdrop : Dialog -> Html msg
backdrop dialog =
  case dialog of
    Closed _ -> div [ class "dialog__backdrop" ] []
    None -> div [ class "dialog__backdrop" ] []
    _ -> div [ class "dialog__backdrop--open" ] []

innerView : Model -> Dialog -> List (Html Msg)
innerView model dialog =
  case dialog of
    Error msg ->
      [ title [ class "dialog__title--warn" ] [ icon "error" [ class "dialog__title-icon" ], text "Oh no" ]
      , content [ text msg ]
      , actions [ cancel ] ]
    ChooseConvention data ->
      [ title [ class "dialog__title" ] [ text "Choose a convention" ]
      , content [ chooseConventionList model.user.keys data ] -- TODO
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

chooseConventionList : Int -> ChooseConvention_ -> Html Msg
chooseConventionList keys { cons, pages, page } =
  tableWithSpacing "1fr 1fr 1fr 70px" (chooseConventionControls pages page) [] [ text "Name", text "Code", text "Date", text "" ] (conventionRow keys) cons

conventionRow : Int -> MetaConvention -> List (Html Msg)
conventionRow keys con =
  let { name, code, start, end } = con in
    [ text name
    , span [ class "text__placeholder" ] [ text code ]
    , span [] [ text <| (Convention.formatDate start) ++ "–" ++ (Convention.formatDate end) ]
    , centered <|
        -- TODO: transition button to close on hover?
        let button = Fancy.button Icon "check" [ disabled (keys <= 0) , onClick <| Batch [AddConvention con, CloseDialog] ]
        in if keys <= 0 then
          Fancy.tooltip "Buy more keys first!" button
        else
          button ]
