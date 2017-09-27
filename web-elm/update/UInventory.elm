module UInventory exposing (update)
import Model exposing (Model)
import Page exposing (Page(..))
import Msg exposing (Msg(..))
import Emit exposing (emit, inventoryTabChange)
import Product
import ProductType
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
    ProductQuantity id quantity ->
      let user = model.user in
      let products = user.products in
      ( { model
        | user =
          { user
          | products = List_.updateAt (\p -> (Product.normalize p).id == id) (Product.setQuantity quantity) products } }
      , Cmd.none )
    ToggleDiscontinued id ->
      let user = model.user in
      let products = user.products in
      ( { model
        | user =
          { user
          | products = List_.filterUpdateAt (\p -> (Product.normalize p).id == id) Product.toggleDiscontinued products } }
      , Cmd.none )
    NewProductType ->
      let user = model.user in
      let productTypes = user.productTypes in
      let len = List.length productTypes in
      update (ChangeInventoryTab len) <|
        { model
        | user =
          { user
          | productTypes = productTypes ++ [ ProductType.new len ] } }
    _ -> (model, Cmd.none)
  _ -> (model, Cmd.none)
