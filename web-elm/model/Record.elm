module Record exposing (Record, decode)
import Json.Decode as Decode exposing (Decoder)
import Date exposing (Date)

type alias Record =
  { products: List Int
  , price: Float
  , time: Date }

decode : Decoder Record
decode =
  Decode.map3 Record
    (Decode.field "products" (Decode.list Decode.int))
    (Decode.field "price" Decode.float)
    (Decode.field "time" (Decode.map (Date.fromTime << toFloat) Decode.int))
