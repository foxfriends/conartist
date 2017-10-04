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
