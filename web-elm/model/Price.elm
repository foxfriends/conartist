module Price exposing (..)
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Json

import List_
import Util
import ProductType exposing (ProductType)
import Product exposing (Product)

type alias FullPrice =
  { index: Int
  , type_id: Int
  , product_id: Maybe Int
  , price: Float
  , quantity: Int }

type alias NewPrice =
  { index: Int
  , type_id: Maybe Int
  , product_id: Maybe Int
  , price: Float
  , quantity: Int }

type alias DeletedPrice =
  { index: Int
  , type_id: Int
  , product_id: Maybe Int }

type alias RequestPrice =
  { type_id: Int
  , product_id: Maybe Int
  , price: List (Int, Float) }

type Price
  = Clean FullPrice
  | Dirty FullPrice
  | New NewPrice
  | Deleted DeletedPrice

isDirty : Price -> Bool
isDirty price = case price of
  Clean _ -> False
  Dirty _ -> True
  New _ -> True
  Deleted _ -> True

decode : Decoder FullPrice
decode =
  Decode.map5 FullPrice
    (Decode.field "index" Decode.int)
    (Decode.field "type" Decode.int)
    (Decode.field "product" (Decode.maybe Decode.int))
    (Decode.field "price" Decode.float)
    (Decode.field "quantity" Decode.int)

normalize : Price -> Maybe NewPrice
normalize price = case price of
  Clean p   -> Just <| NewPrice p.index (Just p.type_id) p.product_id p.price p.quantity
  Dirty p   -> Just <| NewPrice p.index (Just p.type_id) p.product_id p.price p.quantity
  New p     -> Just p
  Deleted _ -> Nothing

setTypeId : Int -> Price -> Price
setTypeId id price = case price of
  Clean p   -> Dirty  { p | type_id = id }
  Dirty p   -> Dirty  { p | type_id = id }
  New p     -> New    { p | type_id = Just id }
  Deleted _ -> price

setProduct : Maybe Int -> Price -> Price
setProduct id price = case price of
  Clean p   -> Dirty  { p | product_id = id }
  Dirty p   -> Dirty  { p | product_id = id }
  New p     -> New    { p | product_id = id }
  Deleted _ -> price

setQuantity : String -> Price -> Price
setQuantity quantityStr price =
  let quantity = Util.toInt quantityStr |> Result.withDefault 0
  in case price of
    Clean p   -> Dirty  { p | quantity = quantity }
    Dirty p   -> Dirty  { p | quantity = quantity }
    New p     -> New    { p | quantity = quantity }
    Deleted _ -> price

setPrice : String -> Price -> Price
setPrice moneyStr price =
  let value = parseMoney moneyStr |> Result.withDefault 0
  in case price of
    Clean p   -> Dirty  { p | price = value }
    Dirty p   -> Dirty  { p | price = value }
    New p     -> New    { p | price = value }
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
  Dirty p   -> p.type_id
  New p     -> p.type_id |> Maybe.withDefault 0
  Deleted p -> p.type_id

productId : Price -> Maybe Int
productId price = case price of
  Clean p   -> p.product_id
  Dirty p   -> p.product_id
  New p     -> p.product_id
  Deleted p -> p.product_id

new : Int -> Price
new index = New (NewPrice index Nothing Nothing 0 0)

parseMoney : String -> Result String Float
parseMoney money =
  case String.uncons money of
    Just ('$', rest) -> parseMoney rest
    _ -> String.toFloat money
      |> Result.map (\x -> toFloat (floor (x * 100)) / 100)

requestFormat : Price -> List RequestPrice -> List RequestPrice
requestFormat price collected =
  case price of
    Clean { type_id, product_id, price, quantity } ->
      List_.updateAtOrInsert (RequestPrice type_id product_id [(quantity, price)])
        (\r -> r.type_id == type_id && r.product_id == product_id)
        (\r -> { r | price = (quantity, price) :: r.price })
        collected
    Dirty { type_id, product_id, price, quantity } ->
      List_.updateAtOrInsert (RequestPrice type_id product_id [(quantity, price)])
        (\r -> r.type_id == type_id && r.product_id == product_id)
        (\r -> { r | price = (quantity, price) :: r.price })
        collected
    New { type_id, product_id, price, quantity } ->
      case type_id of
        Just t ->
          List_.updateAtOrInsert (RequestPrice t product_id [(quantity, price)])
            (\r -> r.type_id == t && r.product_id == product_id)
            (\r -> { r | price = (quantity, price) :: r.price })
            collected
        Nothing -> collected
    Deleted { index, type_id, product_id } ->
      List_.updateAtOrInsert (RequestPrice type_id product_id [])
        (\r -> r.type_id == type_id && r.product_id == product_id)
        identity
        collected

requestJson : RequestPrice -> Json.Value
requestJson request =
  Json.object
    [ ("type_id", Json.int request.type_id)
    , ("product_id", request.product_id |> Maybe.map Json.int |> Maybe.withDefault Json.null)
    , ("price", Json.list (List.map priceItem request.price)) ]

priceItem : (Int, Float) -> Json.Value
priceItem (q, p) = (Json.list [ Json.int q, Json.float p ])

-- NOTE: just assumes that saving worked... maybe not the best policy here but
--       there's no reliable way to link up the returned prices with the existing
--       ones
clean : List FullPrice -> List Price -> List Price
clean _ prices =
  prices
    |> List.filterMap (\price -> case price of
      New p   -> p.type_id |> Maybe.map (\t -> Clean (FullPrice p.index t p.product_id p.price p.quantity))
      Dirty p -> Just (Clean p)
      Clean p -> Just (Clean p)
      Deleted _ -> Nothing)
    |> List.indexedMap setIndex

validateRequest : List Price -> List ProductType -> List Product -> Result String (List Price)
validateRequest prices types products =
  let productName = \id -> products
    |> List.map Product.normalize
    |>  List_.find (\p -> Just p.id == id)
    |> Maybe.map (\p -> p.name)
    |> Maybe.withDefault "" in
  let typeName = \id -> types
    |> List.map ProductType.normalize
    |> List_.find (\p -> Just p.id == id)
    |> Maybe.map (\p -> p.name)
    |> Maybe.withDefault "" in
  let validate = \prices -> \bad -> case prices of
    head :: rest ->
      case normalize head of
        Just { type_id, product_id, quantity, price } ->
          let item = (type_id, product_id, quantity) in
            if quantity == 0 then
              Err <| "There is no quantity set for " ++ productName product_id ++ " " ++ typeName type_id
            else if price < 0 then
              Err <| "The price you have set for " ++ productName product_id ++ " " ++ typeName type_id ++ " is less than $0.00."
            else if type_id == Nothing then
              Err <| "One of your prices does not have a type set for it! All prices require at least a type."
            else if List.member item bad then
              Err <| "Two prices set for buying " ++ toString quantity ++ " " ++ productName product_id ++ " " ++ typeName type_id ++ "(s)"
            else
              validate rest (item :: bad) |> Result.map (\v -> head :: v)
        Nothing -> validate rest bad |> Result.map (\v -> head :: v)
    [] -> Ok [] in
  validate prices []

fillNewTypes : List ProductType.FullType -> List ProductType -> List Price -> List Price
fillNewTypes updates types prices =
  let replacement = \i -> types
    |> List.map ProductType.normalize
    |> List_.find (\t -> t.id == i)
    |> Maybe.andThen (\t -> List_.find (\u -> t.name == u.name) updates)
    |> Maybe.map (\t -> t.id)
    |> Maybe.withDefault i in
  prices
    |> List.map (\price -> case price of
      New p -> New <| case p.type_id of
        Just t -> if t > 0 then p else { p | type_id = Just (replacement t) }
        Nothing -> p
      Clean p -> Clean p
      Dirty p -> Dirty <| if p.type_id > 0 then p else { p | type_id = replacement p.type_id }
      Deleted p -> Deleted <| if p.type_id > 0 then p else { p | type_id = replacement p.type_id })

fillNewProducts : List Product.FullProduct -> List Product -> List Price -> List Price
fillNewProducts updates products prices =
  let replacement = \i -> products
    |> List.map Product.normalize
    |> List_.find (\t -> t.id == i)
    |> Maybe.andThen (\t -> List_.find (\u -> t.name == u.name) updates)
    |> Maybe.map (\t -> t.id)
    |> Maybe.withDefault i in
  prices
    |> List.map (\price -> case price of
      New p -> New  { p | product_id = Maybe.map (\i -> if i > 0 then i else replacement i) p.product_id }
      Clean p -> Clean p
      Dirty p -> Dirty { p | product_id = Maybe.map (\i -> if i > 0 then i else replacement i) p.product_id }
      Deleted p -> Deleted { p | product_id = Maybe.map (\i -> if i > 0 then i else replacement i) p.product_id } )
