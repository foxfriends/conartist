module VConvention exposing (view)
import Html exposing (Html, div)

import Model exposing (Model)
import Msg exposing (Msg(..))
import Page exposing (ConventionPageState)
import Convention exposing (asMeta, asFull)
import Tabs exposing (tabs, TabItem(Tab))

view : Model -> ConventionPageState -> Html Msg
view model page =
  tabs ChangeConventionTab []
    [ Tab "Summary" <| summary model page
    , Tab "Products" <| products model page
    , Tab "Prices" <| prices model page
    , Tab "Sales" <| sales model page
    , Tab "Stats" <| stats model page ]
    page.current_tab

summary : Model -> ConventionPageState -> Html msg
summary _ _ = div [] []

products : Model -> ConventionPageState -> Html msg
products _ _ = div [] []

prices : Model -> ConventionPageState -> Html msg
prices _ _ = div [] []

sales : Model -> ConventionPageState -> Html msg
sales _ _ = div [] []

stats : Model -> ConventionPageState -> Html msg
stats _ _ = div [] []
