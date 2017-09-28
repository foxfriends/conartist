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
    ProductName type_ id name ->
      let user = model.user in
      let products = user.products in
      ( { model
        | user =
          { user
          | products = List_.updateAt (\p -> let q = (Product.normalize p) in q.id == id && q.type_id == type_) (Product.setName name) products } }
      , Cmd.none )
    ProductQuantity type_ id quantity ->
      let user = model.user in
      let products = user.products in
      ( { model
        | user =
          { user
          | products = List_.updateAt (\p -> let q = (Product.normalize p) in q.id == id && q.type_id == type_) (Product.setQuantity quantity) products } }
      , Cmd.none )
    ProductDiscontinued type_ id ->
      let user = model.user in
      let products = user.products in
      ( { model
        | user =
          { user
          | products = List_.filterUpdateAt (\p -> let q = (Product.normalize p) in q.id == id && q.type_id == type_) Product.toggleDiscontinued products } }
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
    NewProduct ->
      let user = model.user in
      let products = user.products in
      let type_id = List.head (List.drop page.current_tab user.productTypes) |> Maybe.map (\x -> (ProductType.normalize x).id) |> Maybe.withDefault 0 in
      let len = products |> List.filter (\x -> (Product.normalize x).type_id == type_id) |> List.length in
      ( { model
        | user =
          { user
          | products = products ++ [ Debug.log "new product" <| Product.new len type_id ] } }
      , Cmd.none )
    _ -> (model, Cmd.none)
  _ -> (model, Cmd.none)
