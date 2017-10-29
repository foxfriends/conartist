module View.Drawer exposing (drawer, Side)
import Html exposing (Html, div)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

type Side = Left | Right

drawer : Bool -> msg -> List (Html.Attribute msg) -> List (Html msg) -> Html msg
drawer open close attrs contents =
  let
    visibility = if open then "--open" else ""
  in
    div (class "drawer" :: attrs)
      [ div [ class <| "drawer__backdrop" ++ visibility, onClick close ] []
      , div [ class <| "drawer__content" ++ visibility ] contents ]
