module Convention exposing (..)
import Json.Decode as Decode exposing (Decoder)
import List exposing (foldl)
import Date exposing (Date)

import Product exposing (Product)
import Price exposing (Price)
import ProductType exposing (ProductType)

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
  , prices: List Price }

type Convention
  = Full FullConvention
  | Meta MetaConvention

isDirty : Convention -> Bool
isDirty con = case con of
  Meta _ -> False
  Full con ->
       (foldl (\c -> \p -> p || ProductType.isDirty c) False con.productTypes)
    || (foldl (\c -> \p -> p || Price.isDirty c) False con.prices)
    || (foldl (\c -> \p -> p || Product.isDirty c) False con.products)

decode : Decoder MetaConvention
decode =
  Decode.map4 MetaConvention
    (Decode.field "title" Decode.string)
    (Decode.field "code" Decode.string)
    (Decode.field "start" (Decode.map stringToDate Decode.string))
    (Decode.field "end" (Decode.map stringToDate Decode.string))

stringToDate : (String -> Date)
stringToDate = Date.fromString >> Result.toMaybe >> (Maybe.withDefault <| Date.fromTime 0)

asMeta : Convention -> MetaConvention
asMeta con = case con of
  Meta con -> con
  Full con -> MetaConvention con.name con.code con.start con.end
