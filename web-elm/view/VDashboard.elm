module VDashboard exposing (view)
import Html exposing (Html, div, button, text, span)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Date exposing (Date)
import Date.Extra as Date exposing (isBetween, toFormattedString)
import List exposing (map, filter, isEmpty, foldl)

import Model exposing (Model)
import Convention exposing (Convention, MetaConvention)
import Msg exposing (Msg(..))
import Card exposing (card)

view : Model -> Html Msg
view model =  let sorted = splitByDate model.now (map Convention.asMeta model.user.conventions) in
  div [ class "dashboard" ]
    [ card "Conventions" []
      [ titledList "Current" conListRow sorted.current
      , titledList "Upcoming" conListRow sorted.upcoming
      , titledList "Previous" conListRow sorted.previous ]
      [ button [ onClick OpenKeyPurchase ] [ text "Buy a key" ]
      , button [ onClick OpenConSignUp ] [ text "Add a convention" ] ] ]

titledList : String -> (a -> Html Msg) -> List a -> Html Msg
titledList title body list =
  if isEmpty list
    then div [ class "list list--empty" ] []
    else div [ class "list"] ( div [ class "list__title" ] [ text title ] :: (list |> map body) )

conListRow : MetaConvention -> Html Msg
conListRow con = let { code, name, start, end } = con in
  div
    [ class "list__row" ]
    [ span [ class "list__column list__column--primary" ] [ text name ]
    , span [ class "list__column list__column--secondary" ] [ text code ]
    , span [ class "list__column list__column--right" ] [ text <| (formatConDate start) ++ "–" ++ (formatConDate end) ] ]

formatConDate : Date -> String
formatConDate = toFormattedString "MMM d, y"

type alias SortedConventions =
  { previous: List MetaConvention
  , current: List MetaConvention
  , upcoming: List MetaConvention }

splitByDate : Date -> List MetaConvention -> SortedConventions
splitByDate now = foldl
  (\con -> \p -> case (Date.compare con.start now, Date.compare now con.end) of
    (LT, LT)  -> { p | current = con :: p.current }
    (EQ, EQ)  -> { p | current = con :: p.current }
    (EQ, LT)  -> { p | current = con :: p.current }
    (LT, EQ)  -> { p | current = con :: p.current }
    (GT, _ )  -> { p | upcoming = con :: p.upcoming }
    (_ , GT)  -> { p | previous = con :: p.previous } )
  (SortedConventions [] [] [])
