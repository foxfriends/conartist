module Convention exposing (..)
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
