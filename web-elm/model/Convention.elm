module Convention exposing (Convention, isDirty, decode)
import Json.Decode as Decode exposing (Decoder)
import List exposing (foldl)
import Date exposing (Date)

import Product exposing (Product)
import Price exposing (Price)
import ProductType exposing (ProductType)
import Maybe_

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

decode : Decoder Convention
decode = Decode.map (\a -> Meta a) <|
  Decode.map4 MetaConvention
    (Decode.field "name" Decode.string)
    (Decode.field "code" Decode.string)
    (Decode.field "start" (Decode.map stringToDate Decode.string))
    (Decode.field "end" (Decode.map stringToDate Decode.string))

stringToDate : (String -> Date)
stringToDate = Date.fromString >> Result.toMaybe >> (Maybe_.unwrap_or <| Date.fromTime 0)
