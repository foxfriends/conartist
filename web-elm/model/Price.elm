module Price exposing (..)
import Json.Decode as Decode exposing (Decoder)

type alias FullPrice =
  { index: Int
  , type_id: Int
  , product_id: Maybe Int
  , price: Float
  , quantity: Int }

type alias DeletedPrice =
  { index: Int }

type Price
  = Clean FullPrice
  | Dirty FullPrice
  | New FullPrice
  | Deleted DeletedPrice

isDirty : Price -> Bool
isDirty price = case price of
  Clean _ -> False
  Dirty _ -> True
  New _ -> True
  Deleted _ -> True

decode : Decoder Price
decode = Decode.map (\a -> Clean a) <|
  Decode.map5 FullPrice
    (Decode.field "index" Decode.int)
    (Decode.field "type" Decode.int)
    (Decode.field "product" (Decode.maybe Decode.int))
    (Decode.field "price" Decode.float)
    (Decode.field "quantity" Decode.int)

normalize : Price -> Maybe FullPrice
normalize price = case price of
  Clean p   -> Just p
  Dirty p   -> Just p
  New p     -> Just p
  Deleted _ -> Nothing

setTypeId : Int -> Price -> Price
setTypeId id price = case price of
  Clean p   -> Dirty  { p | type_id = id }
  Dirty p   -> Dirty  { p | type_id = id }
  New p     -> New    { p | type_id = id }
  Deleted _ -> price

setProduct : Maybe Int -> Price -> Price
setProduct id price = case price of
  Clean p   -> Dirty  { p | product_id = id }
  Dirty p   -> Dirty  { p | product_id = id }
  New p     -> New    { p | product_id = id }
  Deleted _ -> price

setQuantity : Int -> Price -> Price
setQuantity quantity price = case price of
  Clean p   -> Dirty  { p | quantity = quantity }
  Dirty p   -> Dirty  { p | quantity = quantity }
  New p     -> New    { p | quantity = quantity }
  Deleted _ -> price

setPrice : Float -> Price -> Price
setPrice value price = case price of
  Clean p   -> Dirty  { p | price = value }
  Dirty p   -> Dirty  { p | price = value }
  New p     -> New    { p | price = value }
  Deleted _ -> price

removeRow : Int -> List Price -> List Price
removeRow row prices = case prices of
  [] -> []
  head :: rest ->
    if row == 0 then
      Deleted (DeletedPrice (index head)) :: rest
    else
      head :: removeRow (row - 1) rest

index : Price -> Int
index price = case price of
  New p -> p.index
  Clean p -> p.index
  Dirty p -> p.index
  Deleted p -> p.index
