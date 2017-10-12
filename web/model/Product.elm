module Product exposing (..)
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Json
import ProductType exposing (ProductType)
import Dict

import List_
import Util

type alias NewProduct =
  { localId: Int
  , name: String
  , quantity: Int
  , type_id: Int }

type alias FullProduct =
  { id: Int
  , name: String
  , quantity: Int
  , type_id: Int
  , discontinued: Bool }

type alias RequestProduct =
  { kind: String
  , id: Maybe Int
  , type_id: Int
  , name: String
  , quantity: Int
  , discontinued: Bool }

type Product
  = Clean FullProduct
  | Dirty FullProduct
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
    (Decode.field "name" Decode.string)
    (Decode.field "quantity" Decode.int)
    (Decode.field "type" Decode.int)
    (Decode.field "discontinued" Decode.bool)

normalize : Product -> FullProduct
normalize prod = case prod of
  Clean p -> p
  Dirty p -> p
  New   p -> FullProduct -p.localId p.name p.quantity p.type_id False

setName : String -> Product -> Product
setName name product = case product of
  New p   -> New   { p | name = name }
  Clean p -> Dirty { p | name = name }
  Dirty p -> Dirty { p | name = name }

setQuantity : String -> Product -> Product
setQuantity quantityStr product =
  let quantity = Util.toInt quantityStr |> Result.withDefault 0
  in case product of
    New p   -> New { p | quantity = quantity }
    Clean p -> Dirty { p | quantity = quantity }
    Dirty p -> Dirty { p | quantity = quantity }

toggleDiscontinued : Product -> Maybe Product
toggleDiscontinued product = case product of
  New p   -> Nothing
  Clean p -> Just <| Dirty { p | discontinued = not p.discontinued }
  Dirty p -> Just <| Dirty { p | discontinued = not p.discontinued }

requestFormat : Product -> Maybe RequestProduct
requestFormat product = case product of
  New p   -> Just <| RequestProduct "create" Nothing p.type_id p.name p.quantity False
  Clean p -> Nothing
  Dirty p -> Just <| RequestProduct "modify" (Just p.id) p.type_id p.name p.quantity p.discontinued

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
  let replaceNew p =
    updates
      |> List_.find (\x -> x.name == p.name && x.type_id == p.type_id)
      |> Maybe.map Clean
      |> Maybe.withDefault (New p)
  in
    case product of
      Clean _ -> product
      Dirty p -> Clean p
      New   p -> replaceNew p

clean : List FullProduct -> List Product -> List Product
clean updates = List.map (individualClean updates)

fillNewTypes : List ProductType.FullType -> List ProductType -> List Product -> List Product
fillNewTypes updates originals products =
  let oldNews = List.filterMap (\o -> case o of
    ProductType.New p -> Just p
    _                 -> Nothing) originals
  in
  let typeMapping = Dict.fromList (updates |> List.filterMap (\u -> List_.find (\o -> o.name == u.name) oldNews |> Maybe.map (\f -> (f.localId, u.id))))
  in products
    |> List.map (\p -> case p of
      New prod -> New { prod | type_id = Dict.get (-prod.type_id) (Debug.log "type mapping" typeMapping) |> Maybe.withDefault prod.type_id }
      _ -> p)

new : Int -> Int -> Product
new id type_id = New (NewProduct id ("Product " ++ toString id) 0 type_id)

validateRequest : List ProductType -> List Product -> Result String (List Product)
validateRequest types products =
  let validate = (\products -> \bad ->
    case products of
      item :: rest ->
        let { name, type_id } = normalize item in
          if name == "" then
            Err "You cannot leave a product's name blank!"
          else if List.member (type_id, name) bad then
            let typeName = types
              |> List.map ProductType.normalize
              |> List_.find (\x -> x.id == type_id)
              |> Maybe.map (\x -> x.name)
              |> Maybe.withDefault "Product"
            in Err <| "You have two " ++ typeName ++ "s named " ++ name ++ ". Please rename one of them before you save! (Note: one of them might be discontinued)"
          else
            validate rest ((type_id, name) :: bad)
              |> Result.andThen (\valids -> Ok (item :: valids))
      [] -> Ok []
  )
  in validate products []
