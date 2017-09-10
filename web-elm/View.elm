module View exposing (view)
import Html exposing (Html, div)

import Model exposing (Model)
import Page exposing (Page(..))
import Msg exposing (Msg)

import VSignIn
import VDashboard

view : Model -> Html Msg
view model = case model.page of
  SignIn _  -> VSignIn.view model
  Dashboard -> VDashboard.view model
  _         -> div [] []
