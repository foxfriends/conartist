module Model.Expense exposing (Expense)
import Date exposing (Date)
import Model.Money exposing (Money)

type alias Expense =
  { price: Money
  , category: String
  , description: String
  , spend_time: Date }
