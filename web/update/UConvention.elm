module UConvention exposing (update)
import Model exposing (Model)
import Page exposing (Page(..))
import Msg exposing (Msg(..))
import Table exposing (updateSort)

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
    -- TODO: Change chart settings
    _ -> (model, Cmd.none)
  _ -> (model, Cmd.none)
