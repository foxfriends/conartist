module View.Toolbar exposing (view)
import Html exposing (Html, div, span, a, text)
import Html.Attributes exposing (class, href)
import Html.Events exposing (onClick)

import Msg exposing (Msg(..))
import View.Fancy exposing (button, ButtonStyle(..))

view : a -> Html Msg
view _ = div
  [ class "ca__toolbar" ]
  [ button Icon "menu" [ onClick ToggleSidenav, class "fancy-button--light-text" ], span [ class "ca__title" ] [ text "ConArtist" ] ]
