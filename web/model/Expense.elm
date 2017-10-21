module Expense exposing (Expense)
import Date exposing (Date)

type alias Expense =
  { id: Int
  , price: Float
  , category: String
  , description: String
  , spend_time: Date }
