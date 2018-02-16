module Model.Convention exposing
  ( Convention(..)
  , MetaConvention
  , FullConvention
  , asMeta
  , asFull
  , isDirty
  , formatDate
  )
{-| Defines the Convention type from the ConArtist data model.

# Definition
@docs Convention, MetaConvention, FullConvention

# Conversion
@docs asMeta, asFull

# Helpers
@docs isDirty

# Formatters
@docs formatDate
-}
import Date exposing (Date)
import Date.Extra as Date exposing (toUtcFormattedString)

import Model.Product exposing (Product)
import Model.Price exposing (Price)
import Model.ProductType exposing (ProductType)
import Model.Record exposing (Record)
import Model.Expense exposing (Expense)

{-| The minimal information that is required to represent a `Convention`. It contains none of the
user's data -- only information about the convention itself.
-}
type alias MetaConvention =
  { id: Int
  , name: String
  , start: Date
  , end: Date
  , extraInfo: String
  }

{-| The full information of a `Convention`, containing all the user's data.
-}
type alias FullConvention =
  { id: Int
  , name: String
  , start: Date
  , end: Date
  , extraInfo: String
  , products: List Product
  , productTypes: List ProductType
  , prices: List Price
  , records: List Record
  , expenses: List Expense
  }

{-| Unifies the two forms of `Convention` data into one type. Pretty useless on its own, it is more
often used in conjunction with `asMeta` and `asFull`
-}
type Convention
  = Full FullConvention
  | Meta MetaConvention

{-| Extracts the `MetaConvention` information from a `Convention`.

    asMeta con
-}
asMeta : Convention -> MetaConvention
asMeta con = case con of
  Meta con -> con
  Full con -> MetaConvention con.id con.name con.start con.end con.extraInfo

{-| Extracts the `FullConvention` information from a `Convention`, when possible, returning
`Nothing` on failure.

    asFull con
-}
asFull : Convention -> Maybe FullConvention
asFull con = case con of
  Meta con -> Nothing
  Full con -> Just con


{-| Determines whether a convention has been modified or not. Because conventions cannot be modified
from the web client, it always returns `False` and is only included because the other models also
have  an `isDirty` function.

    isDirty con
-}
isDirty : Convention -> Bool
isDirty con = case con of
  Meta _ -> False
  Full _ -> False

{-| Formats the a `Date` as it should be formatted when presenting the start or end date of a
`Convention`

    formatDate (asMeta con).start
-}
formatDate : Date -> String
formatDate = toUtcFormattedString "MMM d, y"
