module VInventory exposing (view)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, type_, disabled, style)
import Html.Events exposing (onInput, onClick)
import Hex

import Model exposing (Model)
import Msg exposing (Msg(..))
import Tabs exposing (tabsWithFooter, TabItem(..))
import ProductType exposing (ProductType, FullType)
import Product exposing (FullProduct)
import Table exposing (table)
import Icon exposing (icon)
import Join exposing (ProductWithType)
import Page exposing (InventoryPageState)
import Fancy exposing (ButtonStyle(..))

view : Model -> InventoryPageState -> Html Msg
view model page =
  let tabList =
    model.user.productTypes
      |> List.map ProductType.normalize
      |> List.filter (\p -> not p.discontinued)
      |> List.map (\t -> (t.name, inventoryTab model t))
      |> List.map Tab
  in
    tabsWithFooter (inventoryFooter model page) ChangeInventoryTab [ class "inventory" ] (tabList ++ [ newTabButton ]) page.current_tab

inventoryTab : Model -> FullType -> Html Msg
inventoryTab model pt =
  div
    [ class "inventory__tab" ]
    [ table []
      [ "Name", "Quantity", "Discontinue" ]
      inventoryRow
      ( Join.productsWithTypes
        (model.user.productTypes
          |> List.map ProductType.normalize
          |> List.filter (\p -> not p.discontinued))
        (model.user.products
          |> List.map Product.normalize
          |> List.filter (\p -> p.type_id == pt.id)
          |> List.filter (\p -> not p.discontinued) ) ) ]

inventoryRow : ProductWithType -> List (Html Msg)
inventoryRow { id, name, quantity, product_type, discontinued } =
  [ Fancy.input "" name [] [ type_ "text", onInput (ProductName product_type.id id) ]
  , Fancy.input "" (toString quantity) [] [ type_ "text", onInput (ProductQuantity product_type.id id) ]
  , Fancy.button Icon (if discontinued then "add_circle_outline" else "remove_circle_outline") [ onClick (ProductDiscontinued product_type.id id) ] ]

newTabButton : TabItem Msg
newTabButton = Button ("add", NewProductType)

inventoryFooter : Model -> InventoryPageState -> List (Html Msg)
inventoryFooter model { current_tab, color_picker } =
  case model.user.productTypes
    |> List.map ProductType.normalize
    |> (if model.show_discontinued then identity else List.filter (\t -> not t.discontinued))
    |> List.drop current_tab
    |> List.head
  of
    Just t ->
      [ Fancy.button Icon (if t.discontinued then "add_circle_outline" else "remove_circle_outline") [ onClick (ProductTypeDiscontinued t.id) ]
      , Fancy.labelledInput (Fancy.iconLabel "edit") "" t.name [] [ onInput (ProductTypeName t.id) ]
      , Fancy.menu []
          ( Fancy.button
            Icon "format_color_fill"
            [ style [ ( "background-color", "#" ++ Hex.toString t.color ) ]
            , onClick ColorPickerOpen ] )
          ( colorPicker (ProductTypeColor t.id) color_picker.page t.color )
          ColorPickerClose
          color_picker.open
      , Fancy.button Icon "add" [ onClick NewProduct ]
      , Fancy.button Icon "save" [ onClick SaveTypes, disabled (not <| Model.isDirty model) ] ]
    Nothing -> []

colorPicker : (Int -> Msg) -> Int -> Int -> Html Msg
colorPicker onSelect page selected =
  div [ class "color-picker" ]
    [ div [ class "color-picker__nav", onClick (ColorPickerPage -1) ] [ icon "keyboard_arrow_left" [] ]
    , div [ class "color-picker__items" ] <| colorPickerContents onSelect page selected
    , div [ class "color-picker__nav", onClick (ColorPickerPage 1) ] [ icon "keyboard_arrow_right" [] ] ]


-- NOTE: first/last 2 are duplicates for simplified looping
colors : List (List Int)
colors =
  [ [ 16764370, 16301008, 14794471, 13747433, 12962537, 12312315, 11789820, 11725810, 11722715, 13166281, 14478792, 15791299, 16775620, 16772275, 16769202, 16764092, 14142664, 16119285, 13621468, 16764370, 16301008 ]
  , [ 15702682, 16027569, 13538264, 11771355, 10463450, 9489145, 8508666, 8445674, 8440772, 10868391, 12968357, 15134364, 16774557, 16769154, 16764032, 16755601, 12364452, 15658734, 11583173, 15702682, 16027569 ]
  , [ 15037299, 15753874, 12216520, 9795021, 7964363, 6600182, 5227511, 5099745, 5093036, 8505220, 11457921, 14477173, 16773494, 16766287, 16758605, 16747109, 10586239, 14737632, 9479342, 15037299, 15753874] ]

colorPickerContents : (Int -> Msg) -> Int -> Int -> List (Html Msg)
colorPickerContents onSelect page selected =
  colors
    |> List.map (List.drop page >> List.take 3)
    |> List.concat
    |> List.map (colorPickerItem onSelect selected)

colorPickerItem : (Int -> Msg) -> Int -> Int -> Html Msg
colorPickerItem onSelect selected color =
  div
    [ class "color-picker__item"
    , style [ ( "background-color", "#" ++ Hex.toString color ) ]
    , onClick (onSelect color) ]
    [ if color == selected then icon "check_circle" [ class "color-picker__selected" ] else text "" ]
