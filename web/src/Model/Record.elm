module Model.Record exposing (Record)
{-| Defines the Record type from the ConArtist data model.

# Definition
@docs Record
-}
import Date exposing (Date)
import Model.Money exposing (Money)

{-| The actual `Record` type
-}
type alias Record =
  { products: List Int
  , price: Money
  , time: Date }
