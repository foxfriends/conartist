module View.Drawer exposing (drawer, drawerContainer, rightDrawer)
import Html exposing (Html, div)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

drawer : Bool -> msg -> List (Html.Attribute msg) -> List (Html msg) -> Html msg
drawer = innerDrawer "left"

rightDrawer : Bool -> msg -> List (Html.Attribute msg) -> List (Html msg) -> Html msg
rightDrawer = innerDrawer "right"

innerDrawer : String -> Bool -> msg -> List (Html.Attribute msg) -> List (Html msg) -> Html msg
innerDrawer side open close attrs contents =
  let
    visibility = if open then "--open" else ""
  in
    div (class ("drawer--" ++ side) :: attrs)
      [ div [ class <| "drawer__backdrop" ++ visibility, onClick close ] []
      , div [ class <| "drawer__content" ++ visibility ] contents ]

drawerContainer : List (Html.Attribute msg) -> Html msg -> Html msg -> Html msg
drawerContainer attrs drawer main_ =
  div (class "drawer__container" :: attrs) [ drawer, main_ ]
