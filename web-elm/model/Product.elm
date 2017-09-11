module Product exposing (Product, isDirty, decode)
import Json.Decode as Decode exposing (Decoder)

type alias NewProduct =
  { name: String
  , quantity: Int
  , type_id: Int }

type alias FullProduct =
  { id: Int
  , name: String
  , quantity: Int
  , type_id: Int
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

decode : Decoder Product
decode = Decode.map (\a -> Clean a) <|
  Decode.map5 FullProduct
    (Decode.field "id" Decode.int)
    (Decode.field "name" Decode.string)
    (Decode.field "quantity" Decode.int)
    (Decode.field "type" Decode.int)
    (Decode.field "discontinued" Decode.bool)
