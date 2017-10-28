module Record exposing (Record)
import Date exposing (Date)

type alias Record =
  { products: List Int
  , price: Float
  , time: Date }
