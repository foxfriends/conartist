module Model.Price exposing (..)
{-| Defines the `Price` type from the ConArtist data model.
-}
import Either exposing (Either(..))
import Dict
import Lazy exposing (lazy)

import Util.List as List
import Util.Either as Either
import Util.Util as Util
import Util.Maybe as Maybe
import Model.ProductType as ProductType exposing (ProductType)
import Model.Product as Product exposing (Product)
import Model.Validation as Validation exposing (Validation(..), valueOf, validate, empty, invalidate, isValid)
import Model.ErrorString exposing (..)
import Model.Money as Money exposing (Money)

type alias FullPrice =
  { index: Int
  , type_id: Int
  , product_id: Maybe Int
  , price: Money
  , quantity: Int }

type alias InternalPrice =
  { index: Int
  , type_id: Either Int Int
  , product_id: Either (Maybe Int) (Maybe Int)
  , price: Either Money (Validation String)
  , quantity: Either Int (Validation String) }

type alias NewPrice =
  { index: Int
  , type_id: Validation Int
  , product_id: Maybe Int
  , price: Validation String
  , quantity: Validation String }

type alias DeletedPrice =
  { index: Int
  , type_id: Int
  , product_id: Maybe Int }

type alias CondensedPrice =
  { type_id: Int
  , product_id: Maybe Int
  , prices: List (Int, Money) }

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

isUpdated : Price -> Bool
isUpdated price = case price of
  Clean _ -> False
  Dirty _ -> True
  New _ -> True
  Deleted _ -> False
normalize : Price -> Maybe FullPrice
normalize price = case price of
  Clean p   -> Just p
  Dirty p   -> Just <| FullPrice
    p.index
    (Either.both p.type_id)
    (Either.both p.product_id)
    (Either.unpack identity (Result.withDefault (Money.money 0) << Money.parse << valueOf) p.price)
    (Either.unpack identity (valueOf >> Util.toInt >> Result.withDefault 0) p.quantity)
  New p     -> Just <| FullPrice
    p.index
    (valueOf p.type_id)
    p.product_id
    (Result.withDefault (Money.money 0) <| Money.parse <| valueOf p.price)
    (Result.withDefault 0 <| Util.toInt <| valueOf p.quantity)
  Deleted _ -> Nothing

priceStr : Either Money String -> String
priceStr = Either.mapLeft Money.prettyprint >> Either.both

priceInt : Either Money String -> Int
priceInt = Either.unpack Money.numeric (Money.parse >> Result.map Money.numeric >> Result.withDefault 0)

priceFloat : Either Money String -> Float
priceFloat = priceInt >> toFloat >> flip (/) 100

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
    { p | type_id = Valid id }
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
      if typeId head == 0 then
        rest
      else
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
  Dirty p   -> Either.both p.type_id
  New p     -> valueOf p.type_id
  Deleted p -> p.type_id

productId : Price -> Maybe Int
productId price = case price of
  Clean p   -> p.product_id
  Dirty p   -> Either.both p.product_id
  New p     -> p.product_id
  Deleted p -> p.product_id

new : Int -> Price
new index = New (NewPrice index (Empty 0 "Choose a type") Nothing (Valid "$0.00") (Valid "0"))

-- NOTE: just assumes that saving worked... maybe can check that later
clean : List (String, CondensedPrice) -> List Price -> List Price
clean _ = List.filterMap (Maybe.map Clean << normalize)

reindex : List Price -> List Price
reindex = List.indexedMap setIndex

validateAll : List Price -> List Price
validateAll prices =
  let
    sets = List.filterMap (normalize >> Maybe.map (\{ type_id, product_id, quantity } -> (type_id, product_id, quantity))) prices
    isBad tpx = List.filter ((==) tpx) sets |> List.length |> (<) 1
    validateQuantity t p q =
      if valueOf q == "" then
        empty emptyQuantity q
      else case Util.toInt <| valueOf q of
        Ok x ->
          if x == 0 then
            empty noQuantity q
          else if x < 0 then
            invalidate negQuantity q
          else if isBad (t, p, x) then
            invalidate duplicateQuantity q
          else
            validate q
        Err _ -> invalidate nanQuantity q
    validatePrice p =
      if valueOf p == "" then
        empty emptyPrice p
      else case Money.parse <| valueOf p of
        Ok x ->
          if Money.numeric x < 0 then
            invalidate negPrice p
          else
            validate p
        Err _ -> invalidate nanPrice p
    check price =
      case price of
        New p -> New
          { p
          | type_id = if valueOf p.type_id == 0 then empty noType p.type_id else validate p.type_id
          , price = validatePrice p.price
          , quantity = validateQuantity (valueOf p.type_id) p.product_id p.quantity
          }
        Clean p -> price
        Dirty p -> Dirty
          { p
          | price = Either.mapRight validatePrice p.price
          , quantity = Either.mapRight (validateQuantity (Either.both p.type_id) (Either.both p.product_id)) p.quantity
          }
        Deleted p -> price
  in List.map check prices

-- TODO: these error messages could be more helpful with type/product information
-- also this error type thing ew. we need help
-- https://github.com/elm-lang/elm-compiler/issues/774
-- http://reasonablypolymorphic.com/blog/elm-is-wrong#fnref3
type ErrorType
  = NanQuantity
  | NegQuantity
  | DupQuantity
  | NanPrice
  | NegPrice
  | NoType
etToInt : ErrorType -> Int
etToInt et = case et of
  NanQuantity -> 1
  NegQuantity -> 2
  DupQuantity -> 3
  NanPrice -> 4
  NegPrice -> 5
  NoType -> 6
intToEt : Int -> ErrorType
intToEt int = case int of
  1 -> NanQuantity
  2 -> NegQuantity
  3 -> DupQuantity
  4 -> NanPrice
  5 -> NegPrice
  6 -> NoType
  _ -> Debug.crash "whoops"
errorMessages : List Price -> List String
errorMessages prices =
  let
    has q = if q == 1 then "has" else "have"
    is q = if q == 1 then "is" else "are"
    aNumber q = if q == 1 then "a number" else "numbers"
    price q = if q == 1 then "price's" else "prices'"
    noTypeMessage q = toString q ++ " of your prices " ++ has q ++ " no type set."
    nanQuantityMessage q = toString q ++ " of your " ++ price q ++ " quantities " ++ is q ++ " not " ++ aNumber q ++ "."
    negQuantityMessage q = toString q ++ " of your " ++ price q ++ " quantities " ++ is q ++ " less than 0."
    duplicateQuantityMessage q = toString q ++ " of your " ++ price q ++ " quantities " ++ is q ++ " listed more than once."
    nanPriceMessage q = toString q ++ " of your " ++ price q ++ " prices " ++ is q ++ " not " ++ aNumber q ++ "."
    negPriceMessage q = toString q ++ " of your " ++ price q ++ " prices " ++ is q ++ " less than 0."
    typeError type_ =
      if Validation.errorFor type_ == Just noType then
        Just NoType
      else Nothing
    priceError price =
      case Validation.errorFor price of
        Just err ->
          if err == nanPrice || err == emptyPrice then
            Just NanPrice
          else if err == negPrice then
            Just NegPrice
          else Nothing
        _ -> Nothing
    quantityError quantity =
      case Validation.errorFor quantity of
        Just err ->
          if err == nanQuantity || err == noQuantity || err == emptyQuantity then
            Just NanQuantity
          else if err == negQuantity then
            Just NegQuantity
          else if err == duplicateQuantity then
            Just DupQuantity
          else Nothing
        _ -> Nothing
    errorMessage price =
      case price of
        New { type_id, quantity, price } ->
          typeError type_id
            |> Maybe.orElse (lazy (\() -> quantityError quantity))
            |> Maybe.orElse (lazy (\() -> priceError price))
        Dirty { type_id, quantity, price } ->
          Either.unpack (always Nothing) quantityError quantity
            |> Maybe.orElse (lazy (\() -> (Either.unpack (always Nothing) priceError price)))
        _ -> Nothing
    collect price messages =
      case errorMessage price of
        Just err ->
          Dict.update
            (etToInt err)
            (Maybe.map ((+) 1) >> Maybe.withDefault 1 >> Just)
            messages
        Nothing -> messages
  in
    List.foldl collect Dict.empty prices
      |> Dict.toList
      |> List.map (\(m, q) ->
        case intToEt m of
          NanQuantity -> nanQuantityMessage q
          NegQuantity -> negQuantityMessage q
          DupQuantity -> duplicateQuantityMessage q
          NanPrice -> nanPriceMessage q
          NegPrice -> negPriceMessage q
          NoType -> noTypeMessage q)

allValid : List Price -> Bool
allValid prices =
  let
    valid price = case price of
      New p -> isValid p.type_id && isValid p.price && isValid p.quantity
      Clean _ -> True
      Dirty p -> Either.unpack (always True) isValid p.price && Either.unpack (always True) isValid p.quantity
      Deleted _ -> True
  in List.all valid prices

fillNewTypes : List ProductType.FullType -> List ProductType -> List Price -> List Price
fillNewTypes updates types prices =
  let replacement i = types
    |> List.map ProductType.normalize
    |> List.find (.id >> (==) i)
    |> Maybe.andThen (\t -> List.find (.name >> (==) t.name) updates)
    |> Maybe.map .id
    |> Maybe.withDefault i
  in prices
    |> List.map (\price -> case price of
      New p -> New <|
        if valueOf p.type_id > 0 then
          p
        else
          { p | type_id = Valid (replacement <| valueOf p.type_id) }
      Clean p -> Clean p
      Dirty p -> Dirty <| if (Either.both p.type_id) > 0 then p else { p | type_id = Right <| replacement (Either.both p.type_id) }
      Deleted p -> Deleted <| if p.type_id > 0 then p else { p | type_id = replacement p.type_id })

fillNewProducts : List Product.FullProduct -> List Product -> List Price -> List Price
fillNewProducts updates products prices =
  let replacement i =
    if i > 0
    then i
    else products
      |> List.map Product.normalize
      |> List.find (.id >> (==) i)
      |> Maybe.andThen (\t -> List.find (.name >> (==) t.name) updates)
      |> Maybe.map .id
      |> Maybe.withDefault i
  in prices
    |> List.map (\price -> case price of
      New p -> New  { p | product_id = Maybe.map replacement p.product_id }
      Clean p -> Clean p
      Dirty p -> Dirty { p | product_id = Right <| Maybe.map replacement (Either.both p.product_id) }
      Deleted p -> Deleted { p | product_id = Maybe.map replacement p.product_id } )

delete : Price -> Maybe Price
delete price = case price of
  New _     -> Nothing
  Clean p   -> Just <| Deleted <| DeletedPrice p.index p.type_id p.product_id
  Dirty p   -> Nothing
  Deleted _ -> Just price

deleted : Price -> Bool
deleted price = case price of
  Deleted _ -> True
  _ -> False

deletedData : Price -> Maybe (Int, Maybe Int)
deletedData price = case price of
  Deleted d -> Just (d.type_id, d.product_id)
  _ -> Nothing

hash : (Int, Maybe Int) -> String
hash (t, p) = toString t ++ "_" ++ toString (Maybe.withDefault 0 p)

collectPrices : Price -> List (Bool, CondensedPrice) -> List (Bool, CondensedPrice)
collectPrices price_ prices =
  case normalize price_ of
    Nothing -> prices
    Just { type_id, product_id, price, quantity } ->
      List.updateAtOrInsert
        (isUpdated price_, (CondensedPrice type_id product_id [(quantity, price)]))
        (\(_, p) -> p.type_id == type_id && p.product_id == product_id)
        (\(m, p) -> (m || isUpdated price_, { p | prices = (quantity, price) :: p.prices }))
        prices
