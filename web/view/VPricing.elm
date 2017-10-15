module VPricing exposing (view)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, type_, disabled)
import Html.Events exposing (onClick, onInput)

import Model exposing (Model)
import Page exposing (PricingPageState, Selector(..))
import Msg exposing (Msg(..))
import Table exposing (sortableTable, TableHeader(..))
import ProductType
import Product
import Price
import Join exposing (PriceWithTypeAndProduct)
import Fancy exposing (ButtonStyle(..))
import Align exposing (centered)
import List_

view : Model -> PricingPageState -> Html Msg
view model page =
  div [ class "pricing" ]
    [ div [ class "pricing__table" ]
      [ sortableTable page.table_sort "1fr 1fr 1fr 1fr 100px" [] []
        [ Sortable "Type" typenamesort SortPricingTable
        , Sortable "Product" productnamesort SortPricingTable
        , Sortable "Quantity" quantitysort SortPricingTable
        , Sortable "Price" pricesort SortPricingTable
        , (Html << centered << text) "Remove" ]
        (priceRow model page)
        ( Join.pricesWithProductsAndTypes
          ( model.user.productTypes
            |> List.map ProductType.normalize
            |> List.filter (not << .discontinued) )
          ( model.user.products
            |> List.map Product.normalize
            |> List.filter (not << .discontinued) )
          ( model.user.prices
            |> List.filterMap Price.normalize) ) ]
    , div [ class "pricing__footer" ] (footer model) ]

priceRow : Model -> PricingPageState -> PriceWithTypeAndProduct -> List (Html Msg)
priceRow model page { index, product_type, quantity, price, product } =
  let
    types = List.map ProductType.normalize model.user.productTypes
    products = model.user.products
      |> List.map Product.normalize
      |> List.filter (.type_id >> Just >> (==) (Maybe.map .id product_type))
  in
    [ Fancy.select
        (SelectProductType index)
        (PricingProductType index)
        (\x -> case x of
          Just x ->
            types
              |> List_.find (.id >> (==) x)
              |> Maybe.map .name
              |> Maybe.withDefault "Unknown type"
          Nothing -> "Choose a type")
        ( types
          |> (if model.show_discontinued then identity else List.filter (\t -> not t.discontinued))
          |> List.map .id )
        (product_type |> Maybe.map .id)
        ( case page.open_selector of
            TypeSelector i -> i == index
            _ -> False )
    , Fancy.optionalSelect
        (SelectProduct index)
        (PricingProduct index)
        (\x -> case x of
          Just x ->
            products
              |> List_.find (.id >> (==) x)
              |> Maybe.map .name
              |> Maybe.withDefault "Unknown product"
          Nothing -> "All")
        ( Nothing ::
          ( products
            |> (if model.show_discontinued then identity else List.filter (not << .discontinued))
            |> List.map .id
            |> List.map Just ) )
        (Maybe.map .id product)
        ( case page.open_selector of
            ProductSelector i -> i == index
            _ -> False )
    , Fancy.input "" (toString quantity) [ Fancy.flush ] [ type_ "text", onInput (PricingQuantity index) ]
    , Fancy.input "" (Price.priceStr price) [ Fancy.flush ] [ type_ "text", onInput (PricingPrice index) ] -- TODO: formatted/validated input fields
    , centered <| Fancy.button Icon "remove_circle_outline" [ onClick (PricingRemove index) ] ]

footer : Model -> List (Html Msg)
footer model =
  let dirty = Model.isDirty model in
  [ Fancy.tooltip "Add row" <| Fancy.button Icon "add" [ onClick PricingAdd ]
  , Fancy.button Icon "save" [ onClick Save, disabled <| not dirty ]
  , Fancy.tooltip (if dirty then "Save changes first!" else "Import (CSV)") <| Fancy.button Icon "file_upload" [ onClick ReadPricingCSV, disabled dirty ]
  , Fancy.tooltip (if dirty then "Save changes first!" else "Export (CSV)") <| Fancy.button Icon "file_download" [ onClick WritePricingCSV, disabled dirty ] ]

typenamesort : PriceWithTypeAndProduct -> PriceWithTypeAndProduct -> Order
typenamesort a b = compare
  (a.product_type |> Maybe.map .name |> Maybe.withDefault "")
  (b.product_type |> Maybe.map .name |> Maybe.withDefault "")

productnamesort : PriceWithTypeAndProduct -> PriceWithTypeAndProduct -> Order
productnamesort a b = compare
  (a.product |> Maybe.map .name |> Maybe.withDefault "")
  (b.product |> Maybe.map .name |> Maybe.withDefault "")

quantitysort : PriceWithTypeAndProduct -> PriceWithTypeAndProduct -> Order
quantitysort a b = compare a.quantity b.quantity

pricesort : PriceWithTypeAndProduct -> PriceWithTypeAndProduct -> Order
pricesort a b = compare (Price.priceFloat a.price) (Price.priceFloat b.price)
