module VDashboard exposing (view)
import Html exposing (Html, div, button, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

import Model exposing (Model)
import Msg exposing (Msg(..))

view : Model -> Html Msg
view _ = div [ class "dashboard" ]
  [ card "Conventions" []
    []
    [ button [ onClick OpenKeyPurchase ] [ text "Buy a key" ]]
    , button [ onClick OpenConSignUp ] [ text "Add a convention" ] ]

card : String -> List (Html.Attribute Msg) -> List (Html Msg) -> List (Html Msg) -> Html Msg
card title attrs contents actions =
  div ([ class "card" ] ++ attrs)
    [ div [ class "card__title" ] [ text title ]
    , div [ class "card__contents" ] contents
    , div [ class "card__actions" ] actions ]
