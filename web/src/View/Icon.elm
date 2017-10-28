module View.Icon exposing (icon)
import Html exposing (Html, span, text)
import Html.Attributes exposing (class)

icon : String -> List (Html.Attribute msg) -> Html msg
icon name attrs =
  span ([ class "icon material-icons" ] ++ attrs) [ text name ]
