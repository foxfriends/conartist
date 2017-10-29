module Update.Convention exposing (update)
import Msg exposing (Msg(..))
import Model.Model exposing (Model)
import Model.Page exposing (Page(..), inventoryChartSettingsPage)
import View.Table exposing (updateSort)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case model.page of
  Convention page -> case msg of
    ChangeConventionTab tab ->
      { model | page = Convention { page | current_tab = tab } } ! []
    SortConProductsTable col ->
      { model | page = Convention { page | product_sort = updateSort col page.product_sort } } ! []
    SortConPricesTable col ->
      { model | page = Convention { page | price_sort = updateSort col page.price_sort } } ! []
    SortConRecordsTable col ->
      { model | page = Convention { page | record_sort = updateSort col page.record_sort } } ! []
    ChartHideSettings ->
      { model | page = Convention { page | open_settings = Nothing } } ! []
    InventoryChartShowSettings ->
      { model | page = Convention { page | open_settings = Just inventoryChartSettingsPage } } ! []
    InventoryChartType type_ ->
      let
        chart_settings = page.chart_settings
        inventory = chart_settings.inventory
      in
      { model | page = Convention { page | chart_settings = { chart_settings | inventory = { inventory | product_type = type_ }}}} ! []
    InventoryChartHover hovering ->
      let
        chart_settings = page.chart_settings
        inventory = chart_settings.inventory
      in
      { model | page = Convention { page | chart_settings = { chart_settings | inventory = { inventory | hovering = hovering }}}} ! []
    _ -> model ! []
  _ -> (model, Cmd.none)
