module VInventory exposing (view)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, type_)
import Html.Events exposing (onInput)

import Model exposing (Model)
import Msg exposing (Msg(..))
import Tabs exposing (tabs)
import ProductType exposing (ProductType, FullType)
import Product exposing (FullProduct)
import Table exposing (table)
import Join exposing (ProductWithType)
import Page exposing (InventoryPageState)
import Fancy

view : Model -> InventoryPageState -> Html Msg
view model page =
  let tabList =
    model.user.productTypes
      |> List.map ProductType.normalize
      |> List.map (\t -> (t.name, inventoryTab model t))
  in
    tabs ChangeInventoryTab [ class "inventory" ] tabList page.current_tab

inventoryTab : Model -> FullType -> Html Msg
inventoryTab model pt =
  div
    [ class "inventory__tab" ]
    [ table
      [ "Name", "Type", "Quantity", "Discontinued" ]
      inventoryRow
      ( Join.productsWithTypes
        (List.map ProductType.normalize model.user.productTypes)
        (List.map Product.normalize model.user.products) ) ]

inventoryRow : ProductWithType -> List (Html Msg)
inventoryRow { id, name, quantity, product_type, discontinued } =
  [ Fancy.input "Product Name" name [] [ type_ "text", onInput (ProductName id) ]
  , text product_type.name, text << toString <| quantity, text << toString <| discontinued ]
