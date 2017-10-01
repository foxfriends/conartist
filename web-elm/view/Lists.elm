module Lists exposing (..)
import Html exposing (Html, div, span, text)
import Html.Attributes exposing (class)
import List exposing (map, isEmpty)

titledList : String -> (a -> Html msg) -> List a -> Html msg
titledList title body list =
  if isEmpty list
    then div [ class "list list--empty" ] []
    else div [ class "list"] ( div [ class "list__title" ] [ span [ class "list__title-text" ] [ text title ] ] :: (list |> map body) )

list : (a -> Html msg) -> List a -> Html msg
list body list =
  if isEmpty list
    then div [ class "list list--empty" ] []
    else div [ class "list" ] (list |> map body)
