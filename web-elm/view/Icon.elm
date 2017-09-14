module Icon exposing (icon)
import Html exposing (Html, span, text)
import Html.Attributes exposing (class)

icon : String -> Html msg
icon name =
  span [ class "material-icons" ] [ text name ]
