module VConvention exposing (view, dateRange)
import Html exposing (Html, div, text, span)
import Html.Attributes exposing (class)
import Date exposing (Date)

import Model exposing (Model)
import Msg exposing (Msg(..))
import Page exposing (ConventionPageState)
import Convention exposing (Convention, MetaConvention, asMeta, asFull)
import Tabs exposing (tabs, TabItem(Tab))
import Card exposing (card)
import Lists exposing (defList)
import List_

view : Model -> ConventionPageState -> Html Msg
view model page =
  case List_.find (\c -> (asMeta c).code == page.convention) model.user.conventions of
      Just con ->
        tabs ChangeConventionTab []
          [ Tab "Summary" <| summary model con
          , Tab "Products" <| products model con
          , Tab "Prices" <| prices model con
          , Tab "Sales" <| sales model con
          , Tab "Stats" <| stats model con ]
        page.current_tab
      Nothing ->
        -- TODO: make this not bad
        div [] [ text "Loading" ]

summary : Model -> Convention -> Html msg
summary _ convention =
  div [ class "convention__summary" ]
    [ conInfo (asMeta convention) ]

conInfo : MetaConvention -> Html msg
conInfo { name, code, start, end }=
  card name
    [ class "convention__card" ]
    [ defList text
      -- TODO: conventions could have more data associated with them...
      [ ( "Code", code )
      , ( "Date", dateRange start end )
      , ( "Location", "Unknown" ) ] ]
    []

products : Model -> Convention -> Html msg
products _ _ = div [] []

prices : Model -> Convention -> Html msg
prices _ _ = div [] []

sales : Model -> Convention -> Html msg
sales _ _ = div [] []

stats : Model -> Convention -> Html msg
stats _ _ = div [] []

dateRange : Date -> Date -> String
dateRange start end = (Convention.formatDate start) ++ "–" ++ (Convention.formatDate end)
