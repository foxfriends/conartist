module View.Convention.Stats exposing (view)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Dict exposing (Dict)
import Mouse

import Msg exposing (Msg(..))
import Model.Model exposing (Model)
import Model.Page exposing (ConventionPageState)
import Model.Convention as Convention exposing (Convention, asFull)
import Model.Product as Product
import Model.ChartSettings as ChartSettings
import View.Chart.Inventory
import View.Chart.Settings as Settings
import View.Drawer as Drawer
import Util.Maybe as Maybe
import View.Convention.Util exposing (frequency, errorPage, placeholder)

view : Model -> ConventionPageState -> Convention -> Html Msg
view model page con =
  case asFull con of
    Nothing -> errorPage
    Just fc -> case fc.records of
      [] -> placeholder "You haven't sold anything, so there are no stats to report!"
      _ ->
        Drawer.drawerContainer [ class "convention__stats-container" ]
          (Drawer.rightDrawer (Maybe.isSomething page.open_settings) ChartHideSettings [] [ Settings.view model page ])
          ( div
              [ class "convention__stats" ]
              [ inventoryChart model.mouse page.chart_settings.inventory fc ] )

inventoryChart : Mouse.Position -> ChartSettings.Inventory -> Convention.FullConvention -> Html Msg
inventoryChart hovering settings fc =
  case settings.product_type of
    -- TODO: adjust placement of settings button to look like it's attached to the chart
    Nothing ->
      div
        [ class "convention__chart" ]
        [ placeholder "Choose a product type"
        -- TODO: put a chart placeholder background image here
        , Settings.button InventoryChartShowSettings ]
    Just type_ ->
      let
        soldQuantity = List.foldl frequency Dict.empty (List.concatMap .products fc.records)
      in View.Chart.Inventory.view
        settings.hovering
        [ class "convention__chart" ]
        [ "#81c784", "#e57373" ]
        (fc.products
          |> List.map Product.normalize
          |> List.filter (.type_id >> (==) type_)
          |> List.map (\{id, name, quantity} ->
            (name
            , [ toFloat quantity
              , toFloat (max 0 <| quantity - (Dict.get id soldQuantity |> Maybe.withDefault 0)) ])))
