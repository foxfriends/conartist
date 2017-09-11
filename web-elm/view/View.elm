module View exposing (view)
import Html exposing (Html, div, main_)
import Html.Attributes exposing (class)

import Model exposing (Model)
import Page exposing (Page(..))
import Msg exposing (Msg)

import VSignIn
import VDashboard
import VSidenav

view : Model -> Html Msg
view model = case model.page of
  SignIn _  -> main_ [ class "ca__content" ] [ VSignIn.view model ]
  _         ->
    div [ class "ca" ]
      [ main_
          [ class "ca__content" ]
          [ case model.page of
              Dashboard -> VDashboard.view model
              _         -> div [] [] ]
      , VSidenav.view model ]
