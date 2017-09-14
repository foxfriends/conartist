module VInventory exposing (view)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)

import Model exposing (Model)
import Msg exposing (Msg(..))
import Tabs exposing (tabs)
import ProductType exposing (ProductType, FullType)
import Product exposing (FullProduct)
import Table exposing (table)
import Join exposing (ProductWithType)

view : Model -> Html Msg
view model =
  let pts = List.map ProductType.normalize model.user.productTypes in
  let tabList = List.map (\t -> (t.name, inventoryTab model t)) pts in
    tabs ChangeInventoryTab [ class "inventory" ] tabList 0

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
inventoryRow { name, quantity, type_, discontinued } =
  [ text name, text type_.name, (text << toString) quantity, (text << toString) discontinued ]
