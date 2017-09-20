module VInventory exposing (view)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, type_, disabled)
import Html.Events exposing (onInput, onClick)

import Model exposing (Model)
import Msg exposing (Msg(..))
import Tabs exposing (tabs)
import ProductType exposing (ProductType, FullType)
import Product exposing (FullProduct)
import Table exposing (table)
import Join exposing (ProductWithType)
import Page exposing (InventoryPageState)
import Fancy exposing (ButtonStyle(..))

view : Model -> InventoryPageState -> Html Msg
view model page =
  let tabList =
    model.user.productTypes
      |> List.map ProductType.normalize
      |> List.map (\t -> (t.name, inventoryTab model t))
  in
    div []
      [ tabs ChangeInventoryTab [ class "inventory" ] tabList page.current_tab
      , Fancy.button FAB "save" [ onClick SaveProducts, disabled (not <| Model.isDirty model) ] ]

inventoryTab : Model -> FullType -> Html Msg
inventoryTab model pt =
  div
    [ class "inventory__tab" ]
    [ table
      [ "Name", "Quantity", "Discontinued" ]
      inventoryRow
      ( Join.productsWithTypes
        (model.user.productTypes
          |> List.map ProductType.normalize)
        (model.user.products
          |> List.map Product.normalize
          |> List.filter (\p -> p.type_id == pt.id)
          |> List.filter (\p -> not p.discontinued) ) ) ]

inventoryRow : ProductWithType -> List (Html Msg)
inventoryRow { id, name, quantity, product_type, discontinued } =
  [ Fancy.input "" name [] [ type_ "text", onInput (ProductName id) ]
  , Fancy.input "" (toString quantity) [] [ type_ "text", onInput (ProductQuantity id) ]
  , Fancy.button Icon (if discontinued then "add_circle_outline" else "remove_circle_outline") [ onClick (ToggleDiscontinued id) ] ]
