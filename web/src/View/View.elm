module View.View exposing (view)
import Html exposing (Html, div, main_)
import Html.Attributes exposing (class)

import Model exposing (Model)
import Page exposing (Page(..))
import Msg exposing (Msg)

import View.SignIn
import View.Dashboard
import View.Sidenav
import View.Toolbar
import View.Inventory
import View.Dialog
import View.Pricing
import View.Conventions
import View.Convention

view : Model -> Html Msg
view model =
  let content =
    case model.page of
      SignIn state -> [ main_ [ class "ca__content" ] [ View.SignIn.view model state ] ]
      _         ->
        [ View.Toolbar.view model
        , div [ class "ca__container" ]
          [ View.Sidenav.view model
          , mainView model ]
        , View.Dialog.view model model.dialog
        , View.Dialog.backdrop model.dialog ]
  in
    div [ class "ca" ] content

mainView : Model -> Html Msg
mainView model =
  main_
    [ class "ca__content" ]
    [ case model.page of
        Dashboard       -> View.Dashboard.view model
        Inventory state -> View.Inventory.view model state
        Pricing state   -> View.Pricing.view model state
        Conventions     -> View.Conventions.view model
        Convention con  -> View.Convention.view model con
        _               -> div [] [] ]
