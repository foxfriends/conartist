module View.Dashboard exposing (view)
import Html exposing (Html, div, text, span)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Date exposing (Date)
import Date.Extra as Date
import List exposing (map, filter, isEmpty, foldl)

import Msg exposing (Msg(..))
import Model.Model exposing (Model)
import Model.Convention as Convention exposing (Convention, MetaConvention)
import View.Card as Card exposing (card, cardWithHeader)
import View.Fancy as Fancy exposing (ButtonStyle(..))
import View.Icon exposing (icon)
import View.List exposing (titledList)
import View.Conventions exposing (conListRow)

view : Model -> Html Msg
view model =
  let
    sorted = splitByDate model.now (map Convention.asMeta model.user.conventions)
    cardHeader =
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
