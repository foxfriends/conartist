module Join exposing (..)
import Date exposing (Date)

import Product exposing (Product, FullProduct)
import ProductType exposing (ProductType, FullType)
import Price exposing (Price)
import Record exposing (Record)
import List_

type alias ProductWithType =
  { product: Product
  , productType: ProductType }

type alias PriceWithType =
  { price: Price
  , productType: Maybe ProductType}

type alias PriceWithTypeAndProduct =
  { price: Price
  , product: Maybe Product
  , productType: Maybe ProductType }

type alias RecordWithTypedProduct =
  { products: List ProductWithType
  , price: Float
  , time: Date }

productsWithTypes : List ProductType -> List Product -> List ProductWithType
productsWithTypes types products =
  List.filterMap
    (\p ->
      List_.find (ProductType.normalize >> .id >> (==) (Product.normalize p).type_id) types
        |> Maybe.map (joinProductToType p))
    products

joinProductToType : Product -> ProductType -> ProductWithType
joinProductToType prod typ = ProductWithType prod typ

pricesWithProductsAndTypes : List ProductType -> List Product -> List Price -> List PriceWithTypeAndProduct
pricesWithProductsAndTypes types products prices =
  prices
    |> List.map (\p -> (p, List_.find (ProductType.normalize >> .id >> (==) (Price.typeId p)) types))
    |> List.map (uncurry joinTypeToPrice)
    |> List.filterMap
      (\p -> case Price.productId p.price of
        Nothing -> Just (p, Nothing)
        Just i -> List_.find (Product.normalize >> .id >> (==) i) products |> Maybe.map (Just >> (,) p))
    |> List.map (uncurry joinProductToTypedPrice)

joinTypeToPrice : Price -> Maybe ProductType -> PriceWithType
joinTypeToPrice price productType =
  PriceWithType price productType

joinProductToTypedPrice : PriceWithType -> Maybe Product -> PriceWithTypeAndProduct
joinProductToTypedPrice price product =
  PriceWithTypeAndProduct price.price product price.productType

recordsWithTypedProducts : List ProductType -> List Product -> List Record -> List RecordWithTypedProduct
recordsWithTypedProducts types products records =
  let typedProducts = productsWithTypes types products in
  List.map (joinProductsToRecord typedProducts) records

joinProductsToRecord : List ProductWithType -> Record -> RecordWithTypedProduct
joinProductsToRecord products record =
  { record
  | products = List.filterMap (\i -> List_.find (.product >> Product.normalize >> .id >> (==) i) products) record.products }
