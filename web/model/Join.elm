module Join exposing (..)
import Either exposing (Either)
import Date exposing (Date)

import Product exposing (FullProduct)
import ProductType exposing (FullType)
import Price exposing (NewPrice)
import Record exposing (Record)
import List_

type alias ProductWithType =
  { id: Int
  , name: String
  , product_type: FullType
  , quantity: Int
  , discontinued: Bool }

type alias PriceWithType =
  { index: Int
  , product_type : Maybe FullType
  , product_id: Maybe Int
  , price: Either String Float
  , quantity: Int }

type alias PriceWithTypeAndProduct =
  { index: Int
  , product_type : Maybe FullType
  , product: Maybe FullProduct
  , price: Either String Float
  , quantity: Int }

type alias RecordWithTypedProduct =
  { products: List ProductWithType
  , price: Float
  , time: Date }

productsWithTypes : List FullType -> List FullProduct -> List ProductWithType
productsWithTypes types products =
  List.filterMap (\p -> Maybe.map (joinProductToType p) <| List_.find (\t -> p.type_id == t.id) types) products

joinProductToType : FullProduct -> FullType -> ProductWithType
joinProductToType { id, name, quantity, discontinued } typ = ProductWithType id name typ quantity discontinued

pricesWithProductsAndTypes : List FullType -> List FullProduct -> List NewPrice -> List PriceWithTypeAndProduct
pricesWithProductsAndTypes types products prices =
  prices
    |> List.map (\p -> (p, List_.find (\t -> Just t.id == p.type_id) types))
    |> List.map (\(p, t) -> joinTypeToPrice p t)
    |> List.filterMap
      (\p -> case p.product_id of
        Nothing -> Just (p, Nothing)
        Just i ->
          List_.find (\r -> r.id == i) products
            |> Maybe.map (\r -> (p, Just r)))
    |> List.map (\(p, r) -> joinProductToTypedPrice p r)

joinTypeToPrice : NewPrice -> Maybe FullType -> PriceWithType
joinTypeToPrice { index, product_id, quantity, price } product_type =
  PriceWithType index product_type product_id price quantity

joinProductToTypedPrice : PriceWithType -> Maybe FullProduct -> PriceWithTypeAndProduct
joinProductToTypedPrice { index, product_type, quantity, price } product =
  PriceWithTypeAndProduct index product_type product price quantity

recordsWithTypedProducts : List FullType -> List FullProduct -> List Record -> List RecordWithTypedProduct
recordsWithTypedProducts types products records =
  let typedProducts = productsWithTypes types products in
  List.map (joinProductsToRecord typedProducts) records

joinProductsToRecord : List ProductWithType -> Record -> RecordWithTypedProduct
joinProductsToRecord products record =
  { record
  | products = List.filterMap (\i -> List_.find (\p -> p.id == i) products) record.products }
