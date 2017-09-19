module UInventory exposing (update)
import Model exposing (Model)
import Page exposing (Page(..))
import Msg exposing (Msg(..))
import Emit exposing (emit, inventoryTabChange)
import Product
import List_

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case model.page of
  Inventory page -> case msg of
    ChangeInventoryTab tab ->
      ( { model | page = Inventory { page | current_tab = tab } }
      , emit (inventoryTabChange tab) )
    DidLoadUser _ ->
      ( model, emit (inventoryTabChange page.current_tab) )
    ProductName id name ->
      let user = model.user in
      let products = user.products in
      ( { model
        | user =
          { user
          | products = List_.updateAt (\p -> (Product.normalize p).id == id) (Product.setName name) products } }
      , Cmd.none )
    _ -> (model, Cmd.none)
  _ -> (model, Cmd.none)
