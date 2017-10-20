module Price exposing (..)
import Either exposing (Either(..))
import FormatNumber exposing (format)
import FormatNumber.Locales exposing (usLocale)

import List_
import Either_
import Util
import ProductType exposing (ProductType)
import Product exposing (Product)
import Validation exposing (Validation(..), valueOf)

type alias FullPrice =
  { index: Int
  , type_id: Int
  , product_id: Maybe Int
  , price: Float
  , quantity: Int }

type alias InternalPrice =
  { index: Int
  , type_id: Either Int Int
  , product_id: Either (Maybe Int) (Maybe Int)
  , price: Either Float (Validation String)
  , quantity: Either Int (Validation String) }

type alias NewPrice =
  { index: Int
  , type_id: Maybe Int
  , product_id: Maybe Int
  , price: Validation String
  , quantity: Validation String }

type alias DeletedPrice =
  { index: Int
  , type_id: Int
  , product_id: Maybe Int }

type Price
  = Clean FullPrice
  | Dirty InternalPrice
  | New NewPrice
  | Deleted DeletedPrice

isDirty : Price -> Bool
isDirty price = case price of
  Clean _ -> False
  Dirty _ -> True
  New _ -> True
  Deleted _ -> True

normalize : Price -> Maybe FullPrice
normalize price = case price of
  Clean p   -> Just p
  Dirty p   -> Just <| FullPrice
    p.index
    (Either_.both p.type_id)
    (Either_.both p.product_id)
    (priceFloat <| Either.mapRight valueOf p.price)
    (Either.unpack identity (valueOf >> Util.toInt >> Result.withDefault 0) p.quantity)
  New p     -> Just <| FullPrice
    p.index
    (Maybe.withDefault 0 p.type_id)
    p.product_id
    (priceFloat <| Right <| valueOf p.price)
    (Result.withDefault 0 <| Util.toInt <| valueOf p.price)
  Deleted _ -> Nothing

priceStr : Either Float String -> String
priceStr = Either.mapLeft moneyFormat >> Either_.both

priceFloat : Either Float String -> Float
priceFloat = Either.mapRight parseMoney >> Either.unpack identity (Result.withDefault 0)

setTypeId : Int -> Price -> Price
setTypeId id price = case price of
  Clean p   -> Dirty
    { p
    | type_id = Right id
    , product_id = Left p.product_id
    , price = Left p.price
    , quantity = Left p.quantity }
  Dirty p   -> Dirty
    { p | type_id = Right id }
  New p     -> New
    { p | type_id = Just id }
  Deleted _ -> price

setProduct : Maybe Int -> Price -> Price
setProduct id price = case price of
  Clean p   -> Dirty
    { p
    | product_id = Right id
    , type_id = Left p.type_id
    , price = Left p.price
    , quantity = Left p.quantity }
  Dirty p   -> Dirty
    { p | product_id = Right id }
  New p     -> New
    { p | product_id = id }
  Deleted _ -> price

setQuantity : String -> Price -> Price
setQuantity quantity price =
  case price of
    Clean p   -> Dirty
      { p
      | quantity = Right (Valid quantity)
      , type_id = Left p.type_id
      , product_id = Left p.product_id
      , price = Left p.price }
    Dirty p   -> Dirty  { p | quantity = Right (Valid quantity) }
    New p     -> New    { p | quantity = Valid quantity }
    Deleted _ -> price

setPrice : String -> Price -> Price
setPrice value price =
  case price of
    Clean p   -> Dirty
      { p
      | price = Right (Valid value)
      , type_id = Left p.type_id
      , product_id = Left p.product_id
      , quantity = Left p.quantity }
    Dirty p   -> Dirty  { p | price = Right (Valid value) }
    New p     -> New    { p | price = Valid value }
    Deleted _ -> price

setIndex : Int -> Price -> Price
setIndex index price = case price of
  Clean p   -> Clean   { p | index = index } -- NOTE: does not dirty because the index is an internal value
  Dirty p   -> Dirty   { p | index = index }
  New p     -> New     { p | index = index }
  Deleted p -> Deleted { p | index = index }

removeRow : Int -> List Price -> List Price
removeRow row prices = case prices of
  [] -> []
  head :: rest ->
    if row == 0 then
      Deleted (DeletedPrice (index head) (typeId head) (productId head)) :: rest
    else
      head :: removeRow (row - 1) rest

index : Price -> Int
index price = case price of
  Clean p   -> p.index
  Dirty p   -> p.index
  New p     -> p.index
  Deleted p -> p.index

typeId : Price -> Int
typeId price = case price of
  Clean p   -> p.type_id
  Dirty p   -> Either_.both p.type_id
  New p     -> p.type_id |> Maybe.withDefault 0
  Deleted p -> p.type_id

productId : Price -> Maybe Int
productId price = case price of
  Clean p   -> p.product_id
  Dirty p   -> Either_.both p.product_id
  New p     -> p.product_id
  Deleted p -> p.product_id

new : Int -> Price
new index = New (NewPrice index Nothing Nothing (Valid "$0.00") (Valid "0"))

parseMoney : String -> Result String Float
parseMoney money =
  case String.uncons money of
    Just ('$', rest) -> parseMoney rest
    _ -> String.toFloat money
      |> Result.map ((*) 100 >> floor >> toFloat >> flip (/) 100)

moneyFormat : Float -> String
moneyFormat = String.cons '$' << format usLocale

-- NOTE: just assumes that saving worked... maybe not the best policy here but
--       there's no reliable way to link up the returned prices with the existing
--       ones
clean : List FullPrice -> List Price -> List Price
clean _ prices =
  prices
    |> List.filterMap (\price -> case price of
      New p -> p.type_id |> Maybe.map
        (\t -> Clean <| FullPrice
          p.index
          t
          p.product_id
          ((valueOf >> Right >> priceFloat) p.price)
          ((valueOf >> Util.toInt >> Result.withDefault 0) p.quantity))
      Dirty p -> Maybe.map Clean <| normalize (Dirty p)
      Clean p -> Just price
      Deleted _ -> Nothing)
    |> List.indexedMap setIndex

-- validateRequest : List Price -> List ProductType -> List Product -> Result String (List Price)
-- validateRequest prices types products =
--   let
--     productName id = products
--       |> List.map Product.normalize
--       |> List_.find (.id >> Just >> (==) id)
--       |> Maybe.map .name
--       |> Maybe.withDefault ""
--     typeName id = types
--       |> List.map ProductType.normalize
--       |> List_.find (.id >> Just >> (==) id)
--       |> Maybe.map .name
--       |> Maybe.withDefault ""
--     validate prices bad = case prices of
--       head :: rest ->
--         case normalize head of
--           Just { type_id, product_id, quantity, price } ->
--             let item = (type_id, product_id, quantity) in
--               if type_id == Nothing then
--                 Err <| "One of your prices does not have a type set for it! All prices require at least a type to be set."
--               else if quantity == 0 then
--                 Err <| "There is no quantity set for " ++ productName product_id ++ " " ++ typeName type_id
--               else if priceFloat price < 0 then
--                 Err <| "The price you have set for " ++ productName product_id ++ " " ++ typeName type_id ++ " is less than $0.00."
--               else if List.member item bad then
--                 Err <| "Two prices set for buying " ++ toString quantity ++ " " ++ productName product_id ++ " " ++ typeName type_id ++ "(s)"
--               else
--                 validate rest (item :: bad) |> Result.map ((::) head)
--           Nothing -> validate rest bad |> Result.map ((::) head)
--       [] -> Ok []
--   in validate prices []

fillNewTypes : List ProductType.FullType -> List ProductType -> List Price -> List Price
fillNewTypes updates types prices =
  let replacement i = types
    |> List.map ProductType.normalize
    |> List_.find (.id >> (==) i)
    |> Maybe.andThen (\t -> List_.find (.name >> (==) t.name) updates)
    |> Maybe.map .id
    |> Maybe.withDefault i
  in prices
    |> List.map (\price -> case price of
      New p -> New <| case p.type_id of
        Just t -> if t > 0 then p else { p | type_id = Just (replacement t) }
        Nothing -> p
      Clean p -> Clean p
      Dirty p -> Dirty <| if (Either_.both p.type_id) > 0 then p else { p | type_id = Right <| replacement (Either_.both p.type_id) }
      Deleted p -> Deleted <| if p.type_id > 0 then p else { p | type_id = replacement p.type_id })

fillNewProducts : List Product.FullProduct -> List Product -> List Price -> List Price
fillNewProducts updates products prices =
  let replacement i =
    if i > 0
    then i
    else products
      |> List.map Product.normalize
      |> List_.find (.id >> (==) i)
      |> Maybe.andThen (\t -> List_.find (.name >> (==) t.name) updates)
      |> Maybe.map .id
      |> Maybe.withDefault i
  in prices
    |> List.map (\price -> case price of
      New p -> New  { p | product_id = Maybe.map replacement p.product_id }
      Clean p -> Clean p
      Dirty p -> Dirty { p | product_id = Right <| Maybe.map replacement (Either_.both p.product_id) }
      Deleted p -> Deleted { p | product_id = Maybe.map replacement p.product_id } )

delete : Price -> Maybe Price
delete price = case price of
  New _     -> Nothing
  Clean p   -> Just <| Deleted <| DeletedPrice p.index p.type_id p.product_id
  Dirty p   -> Nothing
  Deleted _ -> Just price
