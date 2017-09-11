module Price exposing (Price, isDirty, decode)
import Json.Decode as Decode exposing (Decoder)

type alias FullPrice =
  { id: Int
  , type_id: Int
  , product_id: Maybe Int
  , price: Float
  , quantity: Int }

type alias DeletedPrice =
  { id: Int }

type alias NewPrice =
  { type_id: Int
  , product_id: Maybe Int
  , price: Float
  , quantity: Int }

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

decode : Decoder Price
decode = Decode.map (\a -> Clean a) <|
  Decode.map5 FullPrice
    (Decode.field "id" Decode.int)
    (Decode.field "type_id" Decode.int)
    (Decode.field "product_id" (Decode.maybe Decode.int))
    (Decode.field "price" Decode.float)
    (Decode.field "quantity" Decode.int)
