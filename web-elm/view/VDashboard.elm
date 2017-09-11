module VDashboard exposing (view)
import Html exposing (Html, div, button, text, span)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Date exposing (Date)
import Date.Format exposing (format)
import List exposing (map, isEmpty)

import Model exposing (Model)
import Convention exposing (Convention)
import Msg exposing (Msg(..))

view : Model -> Html Msg
view model = div [ class "dashboard" ]
  [ card "Conventions" []
    [ titledList "Previous" conListRow model.user.conventions ]
    [ button [ onClick OpenKeyPurchase ] [ text "Buy a key" ]
    , button [ onClick OpenConSignUp ] [ text "Add a convention" ] ] ]

card : String -> List (Html.Attribute Msg) -> List (Html Msg) -> List (Html Msg) -> Html Msg
card title attrs contents actions =
  div ([ class "card" ] ++ attrs)
    [ div [ class "card__title" ] [ text title ]
    , div [ class "card__contents" ] contents
    , div [ class "card__actions" ] actions ]

titledList : String -> (a -> Html Msg) -> List a -> Html Msg
titledList title body list =
  if isEmpty list
    then div [ class "list list--empty" ] []
    else div [ class "list"] ( div [ class "list__title" ] [ text title ] :: (list |> map body) )

conListRow : Convention -> Html Msg
conListRow con = let { code, name, start, end } = Convention.asMeta con in
  div
    [ class "list__row" ]
    [ span [ class "list__column list__column--primary" ] [ text name ]
    , span [ class "list__column list__column--secondary" ] [ text code ]
    , span [ class "list__column list__column--right" ] [ text <| (formatConDate start) ++ "–" ++ (formatConDate end) ] ]

formatConDate : Date -> String
formatConDate = format "%b %e"
