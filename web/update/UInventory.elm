module UInventory exposing (update)
import Either exposing (Either(..))

import Model exposing (Model)
import Page exposing (Page(..))
import Msg exposing (Msg(..), TabStatus)
import Product exposing (Product(..))
import Table exposing (updateSort)
import Validation exposing (Validation(..))
import ProductType
import List_
import Files
import Util

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case model.page of
  Inventory page -> case msg of
    ChangeInventoryTab tab ->
      { model | page = Inventory { page | current_tab = tab } } ! []
    ProductTypeName id name ->
      let
        user = model.user
        types = user.productTypes
      in
        { model
        | user =
          { user
          | productTypes = ProductType.validateAll <| List_.updateAt (ProductType.normalize >> .id >> (==) id) (ProductType.setName name) types
          }
        } ! []
    ProductTypeColor id color ->
      let
        user = model.user
        types = user.productTypes
      in
        { model
        | user =
          { user
          | productTypes = List_.updateAt (ProductType.normalize >> .id >> (==) id) (ProductType.setColor color) types
          }
        } ! []
    ProductTypeDiscontinued id ->
      let
        user = model.user
        types = user.productTypes
        result =
          { model
          | user =
            { user
            | productTypes = List_.filterUpdateAt (ProductType.normalize >> .id >> (==) id) ProductType.toggleDiscontinued types } }
      in
        if model.show_discontinued
          then result ! []
          else update (ChangeInventoryTab (TabStatus (page.current_tab.current - 1) page.current_tab.width)) result
    ProductName type_ id name ->
      let
        user = model.user
        products = user.products
      in
        { model
        | user =
          { user
          | products = List_.updateAt (\p -> let q = (Product.normalize p) in q.id == id && q.type_id == type_) (Product.setName name) products
          }
        } ! []
    ProductQuantity type_ id quantity ->
      let
        user = model.user
        products = user.products
      in
        { model
        | user =
          { user
          | products = List_.updateAt
              (\p -> let q = (Product.normalize p) in q.id == id && q.type_id == type_)
              (Product.setQuantity quantity)
              products
          }
        } ! []
    ProductDiscontinued type_ id ->
      let
        user = model.user
        products = user.products
      in
        { model
        | user =
          { user
          | products = List_.filterUpdateAt
              (\p -> let q = (Product.normalize p) in q.id == id && q.type_id == type_)
              Product.toggleDiscontinued
              products
          }
        } ! []
    NewProductType ->
      let
        user = model.user
        productTypes = user.productTypes
        len = List.length productTypes
        tabIndex = if model.show_discontinued
          then len
          else productTypes
            |> List.map ProductType.normalize
            |> List.filter (not << .discontinued)
            |> List.length
      in
        update (ChangeInventoryTab <| TabStatus tabIndex page.current_tab.width) <|
          { model
          | user =
            { user
            | productTypes = productTypes ++ [ ProductType.new (len + 1) ] } }
    NewProduct ->
      let
        user = model.user
        type_id = currentType model page.current_tab.current |> Maybe.map .id |> Maybe.withDefault 0
        len = user.products
          |> List.filter (Product.normalize >> .type_id >> (==) type_id)
          |> List.length
      in
        { model
        | user =
          { user
          | products = user.products ++ [ Product.new (len + 1) type_id ]
          }
        } ! []
    ColorPickerOpen ->
      let color_picker = page.color_picker in
        { model
        | page = Inventory
          { page
          | color_picker =
            { open = True
            , page = 0
            }
          }
        } ! []
    ColorPickerPage shift ->
      let color_picker = page.color_picker in
        { model
        | page = Inventory
          { page
          | color_picker =
            { open = True
            , page = (color_picker.page + 19 + shift) % 19
            }
          }
        } ! []
    ColorPickerClose ->
      let color_picker = page.color_picker in
        { model
        | page = Inventory <|
          { page
          | color_picker =
            { open = False
            , page = 0
            }
          }
        } ! []
    SortInventoryTable col ->
      { model
      | page = Inventory
        { page
        | table_sort = updateSort col page.table_sort
        }
      } ! []
    ReadInventoryCSV -> model ! [ Files.read "inventory" ]
    WriteInventoryCSV ->
      let
        type_ = currentType model page.current_tab.current
        typeid = type_ |> Maybe.map .id |> Maybe.withDefault 0
        typename = type_ |> Maybe.map .name |> Maybe.withDefault "inventory"
        contents = model.user.products
          |> List.map Product.normalize
          |> List.filter (.type_id >> (==) typeid)
          |> List.map (\p -> toString p.id ++ "," ++ p.name ++ "," ++ toString p.quantity ++ "\n")
          |> List.foldl (++) ""
      in
        model ! [ curry Files.write (typename ++ ".csv") contents ]
    DidFileRead ("inventory", Just file) ->
      let
        t = currentType model page.current_tab.current |> Maybe.map .id |> Maybe.withDefault 0
        user = model.user
        o = List.length user.products
        products = String.split "\n" file
          |> List.map (List.map String.trim << String.split ",")
          |> List.filterMap (\row -> case row of
            [ id, name, quantity ] ->
              (Util.toInt id)
                |> Result.map (\i -> (i, name, quantity))
                |> Result.toMaybe
            [ name, quantity ] -> Just (-1, name, quantity)
            _ -> Nothing)
          |> List.indexedMap (\x -> \(i, n, q) ->
            ( if i > 0 then
                model.user.products
                  |> List_.find (Product.normalize >> .id >> (==) i)
              else
                model.user.products
                  |> List_.find (\p -> let q = Product.normalize p in q.name == n && q.type_id == t))
            |> Maybe.map (Product.setQuantity q)
            |> Maybe.withDefault (New <| Product.NewProduct (o + x) t n (Valid (Right q))))
          |> List.foldl (\p -> List_.updateAtOrInsert p (Product.normalize >> .id >> (==) (Product.normalize p).id) (always p)) user.products
      in
        { model | user = { user | products = products } } ! []
    _ -> model ! []
  _ -> model ! []

currentType : Model -> Int -> Maybe ProductType.FullType
currentType model current =
  model.user.productTypes
    |> List.map ProductType.normalize
    |> (if model.show_discontinued then identity else List.filter (not << .discontinued))
    |> List.drop current
    |> List.head
