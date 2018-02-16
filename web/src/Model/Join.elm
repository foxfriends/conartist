module Model.Join exposing
  ( ProductWithType
  , PriceWithTypeAndProduct
  , RecordWithTypedProduct
  , productsWithTypes
  , pricesWithProductsAndTypes
  , recordsWithTypedProducts
  )
{-| A series of helper methods to join (as they could be joined via SQL) related parts of the data
model into a single object.

# Products with product types
@docs ProductWithType, productsWithTypes

# Prices with products and product types
@docs PriceWithTypeAndProduct, pricesWithProductsAndTypes

# Records with products
@docs RecordWithTypedProduct, recordsWithTypedProducts
-}
import Date exposing (Date)

import Model.Product as Product exposing (Product, FullProduct)
import Model.ProductType as ProductType exposing (ProductType, FullType)
import Model.Price as Price exposing (Price)
import Model.Record exposing (Record)
import Model.Money exposing (Money)
import Util.List as List

{-| A `Product` joined with its `ProductType`
-}
type alias ProductWithType =
  { product: Product
  , productType: ProductType
  }

{-| A `Price` joined with its `ProductType`. Not particularly useful yet, as it needs to be joined
to its `Product`s still.
-}
type alias PriceWithType =
  { price: Price
  , productType: Maybe ProductType
  }

{-| A `Price` with all the related `Product` and `ProductType` information
-}
type alias PriceWithTypeAndProduct =
  { price: Price
  , product: Maybe Product
  , productType: Maybe ProductType
  }

{-| A `Record` with all its `Product`s filled out with their `ProductType`s
-}
type alias RecordWithTypedProduct =
  { products: List ProductWithType
  , price: Money
  , time: Date
  }

{-| Combines the lists into one list of joined `ProductWithType`s
-}
productsWithTypes : List ProductType -> List Product -> List ProductWithType
productsWithTypes types products =
  List.filterMap
    (\p ->
      List.find (ProductType.normalize >> .id >> (==) (Product.normalize p).type_id) types
        |> Maybe.map (joinProductToType p))
    products

{-| Joins a `Product` with its `ProductType`
-}
joinProductToType : Product -> ProductType -> ProductWithType
joinProductToType prod typ = ProductWithType prod typ

{-| Combines the lists into one list of joined `PriceWithTypeAndProduct`s
-}
pricesWithProductsAndTypes : List ProductType -> List Product -> List Price -> List PriceWithTypeAndProduct
pricesWithProductsAndTypes types products prices =
  prices
    |> List.map (\p -> (p, List.find (ProductType.normalize >> .id >> (==) (Price.typeId p)) types))
    |> List.map (uncurry joinTypeToPrice)
    |> List.filterMap
      (\p -> case Price.productId p.price of
        Nothing -> Just (p, Nothing)
        Just i -> List.find (Product.normalize >> .id >> (==) i) products |> Maybe.map (Just >> (,) p))
    |> List.map (uncurry joinProductToTypedPrice)

{-| Joins the `Price` with its `ProductType`
-}
joinTypeToPrice : Price -> Maybe ProductType -> PriceWithType
joinTypeToPrice price productType =
  PriceWithType price productType

{-| Joins the `PriceWithType` with its `Product` to create the `PriceWithTypeAndProduct`
-}
joinProductToTypedPrice : PriceWithType -> Maybe Product -> PriceWithTypeAndProduct
joinProductToTypedPrice price product =
  PriceWithTypeAndProduct price.price product price.productType

{-| Fills the `ProductWithType`s of all the `Record`s provided
-}
recordsWithTypedProducts : List ProductType -> List Product -> List Record -> List RecordWithTypedProduct
recordsWithTypedProducts types products records =
  let typedProducts = productsWithTypes types products in
  List.map (joinProductsToRecord typedProducts) records

{-| Fills a `Record` with all all its `ProductWithType`s
-}
joinProductsToRecord : List ProductWithType -> Record -> RecordWithTypedProduct
joinProductsToRecord products record =
  { record
  | products = List.filterMap (\i -> List.find (.product >> Product.normalize >> .id >> (==) i) products) record.products }
