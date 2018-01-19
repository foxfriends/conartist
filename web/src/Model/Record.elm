module Model.Record exposing (Record)
import Date exposing (Date)
import Model.Money exposing (Money)

type alias Record =
  { products: List Int
  , price: Money
  , time: Date }
