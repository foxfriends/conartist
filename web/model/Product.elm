module Product exposing (..)
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Json
import ProductType exposing (ProductType)
import Dict
import Either exposing (Either(..))

import Util
import List_
import Either_ exposing (both)
import Validation exposing (Validation(..), valueOf, validate, invalidate)

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

decode : Decoder FullProduct
decode =
  Decode.map5 FullProduct
    (Decode.field "id" Decode.int)
    (Decode.field "type" Decode.int)
    (Decode.field "name" Decode.string)
    (Decode.field "quantity" Decode.int)
    (Decode.field "discontinued" Decode.bool)

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
    (Either.unpack identity (Util.toInt >> Result.withDefault 0) (valueOf p.quantity))
    False

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

requestFormat : Product -> Maybe RequestProduct
requestFormat product = case product of
  New p   -> Just <| RequestProduct "create" Nothing p.type_id (valueOf p.name) (Either.unpack identity toInt (valueOf p.quantity)) False
  Clean p -> Nothing
  Dirty p -> Just <| RequestProduct
    "modify"
    (Just p.id)
    p.type_id
    (Either.unpack identity valueOf p.name)
    (Either.unpack identity (valueOf >> toInt) p.quantity)
    (both p.discontinued)

requestJson : RequestProduct -> Json.Value
requestJson request = Json.object
  [ ("kind", Json.string request.kind)
  , ("id", request.id |> Maybe.map Json.int |> Maybe.withDefault Json.null )
  , ("type", Json.int request.type_id)
  , ("name", Json.string request.name)
  , ("quantity", Json.int request.quantity)
  , ("discontinued", Json.bool request.discontinued) ]

individualClean : List FullProduct -> Product -> Product
individualClean updates product =
  let
    replaceNew p =
      updates
        |> List_.find (\x -> x.name == (valueOf p.name) && x.type_id == p.type_id)
        |> Maybe.map Clean
        |> Maybe.withDefault (New p)
  in
    case product of
      Clean _ -> product
      Dirty p -> Clean (normalize product)
      New   p -> replaceNew p

clean : List FullProduct -> List Product -> List Product
clean updates = List.map (individualClean updates)

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
            (\u -> List_.find (.name >> valueOf >> (==) u.name) oldNews
              |> Maybe.map (.localId >> flip (,) u.id)))
  in products
    |> List.map (\p -> case p of
      New prod -> New { prod | type_id = Dict.get (-prod.type_id) typeMapping |> Maybe.withDefault prod.type_id }
      _ -> p)

new : Int -> Int -> Product
new id type_id = New (NewProduct id type_id (Valid ("Product " ++ toString id)) (Valid <| Left 0))

validateRequest : List ProductType -> List Product -> Result String (List Product)
validateRequest types products =
  let validate products bad =
    case products of
      item :: rest ->
        let { name, type_id, quantity } = normalize item in
          if name == "" then
            Err "You cannot leave a product's name blank!"
          else if quantity < 0 then
            Err <| "You cannot have less than 0 " ++ name ++ "s"
          else if List.member (type_id, name) bad then
            let typeName = types
              |> List.map ProductType.normalize
              |> List_.find (.id >> (==) type_id)
              |> Maybe.map .name
              |> Maybe.withDefault "Product"
            in Err <| "You have two " ++ typeName ++ "s named " ++ name ++ ". Please rename one of them before you save! (Note: one of them might be discontinued)"
          else
            validate rest ((type_id, name) :: bad)
              |> Result.andThen ((::) item >> Ok)
      [] -> Ok []
  in validate products []

validateAll : List Product -> List Product
validateAll products =
  let
    names = List.map (normalize >> (\p -> (p.type_id, p.name))) products
    isBad name = List.filter ((==) name) names |> List.length |> (<) 1
    rec products =
      case products of
        item :: rest ->
          case item of
            Clean i -> Clean i :: rec rest
            New i -> New
              { i
              | name = let v = valueOf i.name in
                  if v == "" then
                    invalidate "Name is empty" i.name
                  else if isBad (i.type_id, v) then
                    invalidate "Name is duplicated" i.name
                  else validate i.name
              , quantity = let v = Either.unpack Ok Util.toInt (valueOf i.quantity) in
                  if isErr v then
                    invalidate "Quantity is not a number" i.quantity
                  else if Result.withDefault 0 v < 0 then
                    invalidate "Quantity is less than 0" i.quantity
                  else
                    validate i.quantity
              } :: rec rest
            Dirty i -> Dirty
              { i
              | name = let v = Either.unpack identity valueOf i.name in
                  if v == "" then
                    Either.mapRight (invalidate "Name is empty") i.name
                  else if isBad (i.type_id, v) then
                    Either.mapRight (invalidate "Name is duplicated") i.name
                  else Either.mapRight validate i.name
              , quantity = let v = Either.unpack Ok (valueOf >> Util.toInt) i.quantity in
                  if isErr v then
                    Either.mapRight (invalidate "Quantity is not a number") i.quantity
                  else if Result.withDefault 0 v < 0 then
                    Either.mapRight (invalidate "Quantity is less than 0") i.quantity
                  else
                    Either.mapRight validate i.quantity } :: rec rest
        [] -> []
  in rec products

isErr : Result a b -> Bool
isErr v = case v of
  Ok _ -> False
  Err _ -> True

toInt : String -> Int
toInt = Util.toInt >> Result.withDefault 0
