module View.Convention.Convention exposing (view)
import Html exposing (Html)

import Msg exposing (Msg(ChangeConventionTab))
import Model.Page exposing (ConventionPageState)
import Model.Convention exposing (asMeta)
import View.Convention.Summary as Summary
import View.Convention.Products as Products
import View.Convention.Prices as Prices
import View.Convention.Sales as Sales
import View.Convention.Stats as Stats
import View.Tabs exposing (tabs, TabItem(Tab))
import View.Convention.Util exposing (placeholder)
import Util.List as List

import Model.Model exposing (Model)
view : Model -> ConventionPageState -> Html Msg
view model page =
  case List.find (asMeta >> .code >> (==) page.convention) model.user.conventions of
      Just con ->
        (tabs
          ChangeConventionTab
          []
            [ Tab "Summary" <| Summary.view model con
            , Tab "Products" <| Products.view model page con
            , Tab "Prices" <| Prices.view model page con
            , Tab "Sales" <| Sales.view model page con
            , Tab "Stats" <| Stats.view model page con ]
          page.current_tab)
      Nothing ->
        placeholder "Convention loading..."
