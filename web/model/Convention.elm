module Convention exposing (..)
import Json.Decode as Decode exposing (Decoder)
import Date exposing (Date)
import Date.Extra as Date exposing (toFormattedString)

import Product exposing (Product)
import Price exposing (Price)
import ProductType exposing (ProductType)
import Record exposing (Record)

type alias MetaConvention =
  { name: String
  , code: String
  , start: Date
  , end: Date }

type alias FullConvention =
  { name: String
  , code: String
  , start: Date
  , end: Date
  , products: List Product
  , productTypes: List ProductType
  , prices: List Price
  , records: List Record }

type Convention
  = Full FullConvention
  | Meta MetaConvention

isDirty : Convention -> Bool
isDirty con = case con of
  Meta _ -> False
  Full _ -> False

decode : Decoder MetaConvention
decode =
  Decode.map4 MetaConvention
    (Decode.field "title" Decode.string)
    (Decode.field "code" Decode.string)
    (Decode.field "start" (Decode.map stringToDate Decode.string))
    (Decode.field "end" (Decode.map stringToDate Decode.string))

fullDecode : Decoder FullConvention
fullDecode =
  Decode.map8 FullConvention
    (Decode.field "title" Decode.string)
    (Decode.field "code" Decode.string)
    (Decode.field "start" (Decode.map stringToDate Decode.string))
    (Decode.field "end" (Decode.map stringToDate Decode.string))
    (Decode.at ["data", "products"] (Decode.list <| Decode.map Product.Clean Product.decode))
    (Decode.at ["data", "types"] (Decode.list <| Decode.map ProductType.Clean ProductType.decode))
    (Decode.at ["data", "prices"] (Decode.list <| Decode.map Price.Clean Price.decode))
    (Decode.at ["data", "records"] (Decode.list Record.decode))

stringToDate : (String -> Date)
stringToDate = Date.fromString >> Result.toMaybe >> (Maybe.withDefault <| Date.fromTime 0)

asMeta : Convention -> MetaConvention
asMeta con = case con of
  Meta con -> con
  Full con -> MetaConvention con.name con.code con.start con.end

asFull : Convention -> Maybe FullConvention
asFull con = case con of
  Meta con -> Nothing
  Full con -> Just con

formatDate : Date -> String
formatDate = toFormattedString "MMM d, y"
