module Join exposing (..)
import Product exposing (FullProduct)
import ProductType exposing (FullType)
import Price exposing (FullPrice)
import List_

type alias ProductWithType =
  { id: Int
  , name: String
  , product_type: FullType
  , quantity: Int
  , discontinued: Bool }

type alias PriceWithType =
  { index: Int
  , product_type : FullType
  , product_id: Maybe Int
  , price: Float
  , quantity: Int }

type alias PriceWithTypeAndProduct =
  { index: Int
  , product_type : FullType
  , product: Maybe FullProduct
  , price: Float
  , quantity: Int }

productsWithTypes : List FullType -> List FullProduct -> List ProductWithType
productsWithTypes types products =
  List.filterMap (\p -> Maybe.map (joinProductToType p) <| List_.find (\t -> p.type_id == t.id) types) products

joinProductToType : FullProduct -> FullType -> ProductWithType
joinProductToType { id, name, quantity, discontinued } typ = ProductWithType id name typ quantity discontinued

pricesWithProductsAndTypes : List FullType -> List FullProduct -> List FullPrice -> List PriceWithTypeAndProduct
pricesWithProductsAndTypes types products prices =
  prices
    |> List.filterMap (\p ->
        List_.find (\t -> t.id == p.type_id) types
          |> Maybe.map (\t -> (p, t)))
    |> List.map (\(p, t) -> joinTypeToPrice p t)
    |> List.filterMap
      (\p -> case p.product_id of
        Nothing -> Just (p, Nothing)
        Just i ->
          List_.find (\r -> r.id == i) products
            |> Maybe.map (\r -> (p, Just r)))
    |> List.map (\(p, r) -> joinProductToTypedPrice p r)

joinTypeToPrice : FullPrice -> FullType -> PriceWithType
joinTypeToPrice { index, product_id, quantity, price } product_type =
  PriceWithType index product_type product_id price quantity

joinProductToTypedPrice : PriceWithType -> Maybe FullProduct -> PriceWithTypeAndProduct
joinProductToTypedPrice { index, product_type, quantity, price } product =
  PriceWithTypeAndProduct index product_type product price quantity
