module View exposing (view)
import Model exposing (Model)
import Html exposing (Html, div)
import Page exposing (Page(..))
import Msg exposing (Msg)

import VSignIn
import VDashboard

view : Model -> Html Msg
view model = case model.page of
  SignIn _  -> VSignIn.view model
  Dashboard -> VDashboard.view model
  _         -> div [] []
