module Model.Product exposing (..)
import Dict
import Either exposing (Either(..))
import MD5

import Util.Util as Util
import Util.List as List
import Util.Either exposing (both)
import Util.Result exposing (isErr)
import Model.ProductType as ProductType exposing (ProductType)
import Model.Validation as Validation exposing (Validation(..), valueOf, validate, invalidate)
import Model.ErrorString exposing (..)

type alias NewProduct =
  { localId: Int
  , type_id: Int
  , name: Validation String
  , quantity: Validation (Either Int String) }

type alias FullProduct =
  { id: Int
  , type_id: Int
  , name: String
  , quantity: Int
  , discontinued: Bool }

type alias InternalProduct =
  { id: Int
  , type_id: Int
  , name: Either String (Validation String)
  , quantity: Either Int (Validation String)
  , discontinued: Either Bool Bool }

type alias RequestProduct =
  { kind: String
  , id: Maybe Int
  , type_id: Int
  , name: String
  , quantity: Int
  , discontinued: Bool }

type Product
  = Clean FullProduct
  | Dirty InternalProduct
  | New NewProduct

isDirty : Product -> Bool
isDirty prod = case prod of
  Clean _ -> False
  Dirty _ -> True
  New   _ -> True

normalize : Product -> FullProduct
normalize prod = case prod of
  Clean p -> p
  Dirty p -> FullProduct
    p.id
    p.type_id
    (Either.unpack identity valueOf p.name)
    (Either.unpack identity (valueOf >> toInt) p.quantity)
    (both p.discontinued)
  New   p -> FullProduct
    -p.localId
    p.type_id
    (valueOf p.name)
    (Either.unpack identity toInt (valueOf p.quantity))
    False

newData : Product -> Maybe NewProduct
newData p = case p of
  New v -> Just v
  _ -> Nothing

dirtyData : Product -> Maybe InternalProduct
dirtyData p = case p of
  Dirty v -> Just v
  _ -> Nothing

setName : String -> Product -> Product
setName name product = case product of
  New p   -> New   { p | name = Valid name }
  Clean p -> Dirty
    { p
    | name = Right (Valid name)
    , quantity = Left p.quantity
    , discontinued = Left p.discontinued }
  Dirty p -> Dirty { p | name = Right (Valid name) }

setQuantity : String -> Product -> Product
setQuantity quantityStr product =
  case product of
    New p   -> New { p | quantity = Valid (Right quantityStr) }
    Clean p -> Dirty
      { p
      | quantity = Right (Valid quantityStr)
      , discontinued = Left p.discontinued
      , name = Left p.name }
    Dirty p -> Dirty { p | quantity = Right (Valid quantityStr) }

toggleDiscontinued : Product -> Maybe Product
toggleDiscontinued product = case product of
  New p   -> Nothing
  Clean p -> Just <| Dirty
    { p
    | discontinued = Right <| not p.discontinued
    , name = Left p.name
    , quantity = Left p.quantity }
  Dirty p -> Just <| Dirty { p | discontinued = Right <| not (both p.discontinued) }

individualClean : List (String, FullProduct) -> Product -> Product
individualClean updates product =
  let
    replaceNew p =
      updates
        |> List.find (Tuple.first >> (==) (hash (New p)))
        |> Maybe.map (Tuple.second >> Clean)
        |> Maybe.withDefault (New p)
    replaceDirty p =
      updates
        |> List.find (Tuple.first >> (==) (hash (Dirty p)))
        |> Maybe.map (Clean << Tuple.second)
        |> Maybe.withDefault (Dirty p)
  in
    case product of
      Clean _ -> product
      Dirty p -> replaceDirty p
      New   p -> replaceNew p

clean : List (String, FullProduct) -> List Product -> List Product
clean = List.map << individualClean

fillNewTypes : List ProductType.FullType -> List ProductType -> List Product -> List Product
fillNewTypes updates originals products =
  let
    oldNews = List.filterMap (\o -> case o of
      ProductType.New p -> Just p
      _                 -> Nothing) originals
    typeMapping =
      Dict.fromList
        (updates
          |> List.filterMap
            (\u -> List.find (.name >> valueOf >> (==) u.name) oldNews
              |> Maybe.map (.localId >> flip (,) u.id)))
  in products
    |> List.map (\p -> case p of
      New prod -> New { prod | type_id = Dict.get (-prod.type_id) typeMapping |> Maybe.withDefault prod.type_id }
      _ -> p)

new : Int -> Int -> Product
new id type_id = New (NewProduct id type_id (Valid ("Product " ++ toString id)) (Valid <| Left 0))

validateAll : List Product -> List Product
validateAll products =
  let
    names = List.map (normalize >> (\p -> (p.type_id, p.name))) products
    isBad name = List.filter ((==) name) names |> List.length |> (<) 1
    check product =
      case product of
        Clean i -> Clean i
        New i -> New
          { i
          | name = let v = valueOf i.name in
              if v == "" then
                invalidate emptyName i.name
              else if isBad (i.type_id, v) then
                invalidate duplicateName i.name
              else validate i.name
          , quantity = let v = Either.unpack Ok Util.toInt (valueOf i.quantity) in
              if isErr v then
                invalidate nanQuantity i.quantity
              else if Result.withDefault 0 v < 0 then
                invalidate negQuantity i.quantity
              else
                validate i.quantity
          }
        Dirty i -> Dirty
          { i
          | name = let v = Either.unpack identity valueOf i.name in
              if v == "" then
                Either.mapRight (invalidate emptyName) i.name
              else if isBad (i.type_id, v) then
                Either.mapRight (invalidate duplicateName) i.name
              else Either.mapRight validate i.name
          , quantity = let v = Either.unpack Ok (valueOf >> Util.toInt) i.quantity in
              if isErr v then
                Either.mapRight (invalidate nanQuantity) i.quantity
              else if Result.withDefault 0 v < 0 then
                Either.mapRight (invalidate negQuantity) i.quantity
              else
                Either.mapRight validate i.quantity
          }
  in List.map check products

allValid : List Product -> Bool
allValid products =
  let isValid product =
    case product of
      New t   -> Validation.isValid t.name && Validation.isValid t.quantity
      Clean _ -> True
      Dirty t ->
        (Either.unpack (always True) Validation.isValid t.name)
        && (Either.unpack (always True) Validation.isValid t.quantity)
  in List.all isValid products

toInt : String -> Int
toInt = Util.toInt >> Result.withDefault 0

hash : Product -> String
hash pr = case pr of
  New p -> MD5.hex (valueOf p.name) ++ "_" ++ toString p.type_id
  Dirty p -> MD5.hex <| (Either.unpack identity valueOf p.name ++ "_" ++ toString p.type_id)
  Clean p -> ""
