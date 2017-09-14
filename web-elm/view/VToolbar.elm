module VToolbar exposing (view)
import Html exposing (Html, div, a, text)
import Html.Attributes exposing (class, href)
import Html.Events exposing (onClick)

import Model exposing (Model)
import Msg exposing (Msg(..))
import Fancy exposing (button, ButtonStyle(..))

view : Model -> Html Msg
view _ = div
  [ class "ca__toolbar" ]
  [ button Icon "menu" [ onClick ToggleSidenav ], text "ConArtist" ]
