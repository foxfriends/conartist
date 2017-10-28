module View.Align exposing (centered)
import Html exposing (Html, div)
import Html.Attributes exposing (class)

centered : Html msg -> Html msg
centered = div [ class "align--centered"] << List.singleton
