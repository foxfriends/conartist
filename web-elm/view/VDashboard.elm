module VDashboard exposing (view)
import Html exposing (Html, div, button, text, span)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Date exposing (Date)
import Date.Extra as Date
import List exposing (map, filter, isEmpty, foldl)

import Model exposing (Model)
import Convention exposing (Convention, MetaConvention)
import Msg exposing (Msg(..))
import Card exposing (card, cardWithHeader)
import Fancy exposing (ButtonStyle(..))
import Icon exposing (icon)
import Routing exposing (conventionPath)
import Lists exposing (titledList)

view : Model -> Html Msg
view model =
  let sorted = splitByDate model.now (map Convention.asMeta model.user.conventions) in
  let cardHeader =
    [ text "Conventions"
    , span [ class "dashboard__keys" ] [ Fancy.buttonWithContent Flat [ icon "vpn_key" [], text << toString <| model.user.keys ] [] ] ]
  in
    div
      [ class "dashboard" ]
      [ cardWithHeader cardHeader [ class "dashboard__card" ]
        ( if isEmpty model.user.conventions then
            [ div
              [ Card.placeholder ]
              [ text "You haven't signed up for any conventions yet!" ] ]
          else
            [ titledList "Current" conListRow sorted.current
            , titledList "Upcoming" conListRow sorted.upcoming
            , titledList "Previous" conListRow sorted.previous ] )
        [ Fancy.button Primary "Buy a key" [ onClick OpenKeyPurchase ]
        , Fancy.button Primary "Add a convention" [ onClick OpenChooseConvention ] ] ]

conListRow : MetaConvention -> Html Msg
conListRow con = let { code, name, start, end } = con in
  div
    [ class "list__row list__row--clickable", onClick (DoNav (conventionPath code)) ]
    [ span [ class "list__column" ] [ text name ]
    , span [ class "list__column" ] [ text code ]
    , span [ class "list__column" ] [ text <| (Convention.formatDate start) ++ "–" ++ (Convention.formatDate end) ] ]

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
