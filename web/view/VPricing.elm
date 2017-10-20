module VPricing exposing (view)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, type_, disabled)
import Html.Events exposing (onClick, onInput)
import Either exposing (Either(..))

import Model exposing (Model)
import Page exposing (PricingPageState, Selector(..))
import Msg exposing (Msg(..))
import Table exposing (sortableTable, TableHeader(..))
import ProductType
import Product
import Price exposing (Price(..))
import Join exposing (PriceWithTypeAndProduct)
import Fancy exposing (ButtonStyle(..))
import Align exposing (centered)
import List_
import Validation exposing (Validation(..))

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
            -- TODO: "show discontinued"
            |> List.filter (not << .discontinued << ProductType.normalize) )
          ( model.user.products
            |> List.filter (not << .discontinued << Product.normalize) )
          ( List.filter (not << Price.deleted) model.user.prices) ) ]
    , div [ class "pricing__footer" ] (footer model) ]

priceRow : Model -> PricingPageState -> PriceWithTypeAndProduct -> List (Html Msg)
priceRow model page { productType, product, price } =
  let
    index = Price.index price
    types = List.map ProductType.normalize model.user.productTypes
    products = model.user.products
      |> List.map Product.normalize
      |> List.filter (.type_id >> Just >> (==) (Maybe.map (ProductType.normalize >> .id) productType))
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
        (productType |> Maybe.map (ProductType.normalize >> .id))
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
        (Maybe.map (Product.normalize >> .id) product)
        ( case page.open_selector of
            ProductSelector i -> i == index
            _ -> False )
    , let quantity = case price of
        New p -> p.quantity
        Clean p -> Valid <| toString p.quantity
        Dirty p -> Either.unpack (Valid << toString) identity p.quantity
        Deleted _ -> Valid "0"
      in
        Fancy.validatedInput "" quantity [ Fancy.flush ] [ type_ "text", onInput (PricingQuantity index) ]
    , let value = case price of
        New p -> p.price
        Clean p -> Valid <| toString p.price
        Dirty p -> Either.unpack (Valid << Price.priceStr << Left) identity p.price
        Deleted _ -> Valid "0"
      in
        Fancy.validatedInput "" value [ Fancy.flush ] [ type_ "text", onInput (PricingPrice index) ]
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
  (a.productType |> Maybe.map (ProductType.normalize >> .name) |> Maybe.withDefault "")
  (b.productType |> Maybe.map (ProductType.normalize >> .name) |> Maybe.withDefault "")

productnamesort : PriceWithTypeAndProduct -> PriceWithTypeAndProduct -> Order
productnamesort a b = compare
  (a.product |> Maybe.map (Product.normalize >> .name) |> Maybe.withDefault "")
  (b.product |> Maybe.map (Product.normalize >> .name) |> Maybe.withDefault "")

quantitysort : PriceWithTypeAndProduct -> PriceWithTypeAndProduct -> Order
quantitysort a b =
  let extract = Price.normalize >> Maybe.map .quantity >> Maybe.withDefault 0 in
    compare (extract a.price) (extract b.price)

pricesort : PriceWithTypeAndProduct -> PriceWithTypeAndProduct -> Order
pricesort a b =
  let extract = Price.normalize >> Maybe.map .price >> Maybe.withDefault 0 in
    compare (extract a.price) (extract b.price)
