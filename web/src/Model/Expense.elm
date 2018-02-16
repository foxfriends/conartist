module Model.Expense exposing (Expense)
{-| Defines the Expense type from the ConArtist data model.

# Definition
@docs Expense
-}
import Date exposing (Date)
import Model.Money exposing (Money)

{-| The actual Expense data type
-}
type alias Expense =
  { price: Money
  , category: String
  , description: String
  , spend_time: Date
  }
