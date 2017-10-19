module VInventory exposing (view)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, type_, disabled, style)
import Html.Events exposing (onInput, onClick)
import Hex
import Either

import Either_ exposing (both)
import Model exposing (Model)
import Msg exposing (Msg(..))
import Tabs exposing (tabsWithFooter, TabItem(..))
import ProductType exposing (ProductType, FullType)
import Product exposing (FullProduct)
import Table exposing (sortableTable, TableHeader(..))
import Icon exposing (icon)
import Join exposing (ProductWithType)
import Page exposing (InventoryPageState)
import Fancy exposing (ButtonStyle(..), TooltipAlignment(..))
import Align exposing (centered)
import Validation exposing (Validation(..))

view : Model -> InventoryPageState -> Html Msg
view model page =
  let tabList =
    model.user.productTypes
      |> List.map ProductType.normalize
      |> List.filter (\p -> not p.discontinued)
      |> List.map (\t -> Tab t.name (inventoryTab model page t))
  in
    tabsWithFooter (inventoryFooter model page) ChangeInventoryTab [ class "inventory" ] (tabList ++ [ newTabButton ]) page.current_tab

-- TODO: tabindex allows selecting the input fields from tabs that are not the current tab
inventoryTab : Model -> InventoryPageState -> FullType -> Html Msg
inventoryTab model page pt =
  div
    [ class "inventory__tab" ]
    [ sortableTable page.table_sort "1fr 1fr 150px" [] []
      [ Sortable "Name" namesort SortInventoryTable
      , Sortable "Quantity" qtysort SortInventoryTable
      , (Html << centered << text) "Discontinue" ]
      inventoryRow
      ( Join.productsWithTypes
        (model.user.productTypes
          |> List.filter (not << .discontinued << ProductType.normalize))
        (model.user.products
          |> List.filter (Product.normalize >> .type_id >> (==) pt.id)
          |> List.filter (not << .discontinued << Product.normalize) ) ) ]

namesort : ProductWithType -> ProductWithType -> Order
namesort a b = compare (Product.normalize a.product).name (Product.normalize b.product).name

qtysort : ProductWithType -> ProductWithType -> Order
qtysort a b = compare (Product.normalize a.product).quantity (Product.normalize b.product).quantity

inventoryRow : ProductWithType -> List (Html Msg)
inventoryRow { product, productType } =
  let
    pt = ProductType.normalize productType
    (name, quantity, id, discontinued) = case product of
      Product.New { name, quantity, localId } -> (name, Validation.map (Either.unpack toString identity) quantity, -localId, False)
      Product.Clean { name, quantity, id, discontinued } -> (Valid name, Valid (toString quantity), id, discontinued)
      Product.Dirty { name, quantity, id, discontinued } -> (Either.unpack Valid identity name, Either.unpack (Valid << toString) identity quantity, id, both discontinued)
  in
    [ Fancy.validatedInput "" name [ Fancy.flush ] [ type_ "text", onInput (ProductName pt.id id) ]
    , Fancy.validatedInput "" quantity [ Fancy.flush ] [ type_ "text", onInput (ProductQuantity pt.id id) ]
    , centered <|
        Fancy.button Icon
          (if discontinued then "add_circle_outline" else "remove_circle_outline")
          [ onClick (ProductDiscontinued pt.id id) ] ]

newTabButton : TabItem Msg
newTabButton = IconButton "add" NewProductType

inventoryFooter : Model -> InventoryPageState -> List (Html Msg)
inventoryFooter model { current_tab, color_picker } =
  let dirty = Model.isDirty model in
  case model.user.productTypes
    |> (if model.show_discontinued then identity else List.filter (not << .discontinued << ProductType.normalize))
    |> List.drop current_tab.current
    |> List.head
  of
    Just pt ->
      let
        t = ProductType.normalize pt
        name = case pt of
          ProductType.New { name } -> name
          ProductType.Clean { name } -> Valid name
          ProductType.Dirty { name } -> Either.unpack Valid identity name
      in
        [ Fancy.alignedTooltip Right "Discontinue type" <| Fancy.button Icon (if t.discontinued then "add_circle_outline" else "remove_circle_outline") [ onClick (ProductTypeDiscontinued t.id) ]
        , Fancy.labelledInput (Fancy.iconLabel "edit") "" name [] [ onInput (ProductTypeName t.id) ]
        , Fancy.menu []
            ( Fancy.tooltip "Set color" <| Fancy.button
              Icon "format_color_fill"
              [ style [ ( "background-color", "#" ++ Hex.toString t.color ) ]
              , onClick ColorPickerOpen ] )
            ( colorPicker (ProductTypeColor t.id) color_picker.page t.color )
            ColorPickerClose
            color_picker.open
        , Fancy.tooltip "New product" <| Fancy.button Icon "add" [ onClick NewProduct ]
        , Fancy.button Icon "save" [ onClick Save, disabled (not dirty) ]
        , Fancy.tooltip (if dirty then "Save changes first!" else "Import (CSV)") <| Fancy.button Icon "file_upload" [ onClick ReadInventoryCSV, disabled dirty ]
        , Fancy.tooltip (if dirty then "Save changes first!" else "Export (CSV)") <| Fancy.button Icon "file_download" [ onClick WriteInventoryCSV, disabled dirty ] ]
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
