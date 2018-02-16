module Model.User exposing (User, new)
{-| Contains all the user's information as retrieved from the server

# Definition
@docs User, new
-}

import Model.Product exposing (Product)
import Model.ProductType exposing (ProductType)
import Model.Price exposing (Price)
import Model.Convention exposing (Convention)

{-| The actual `User` data type
-}
type alias User =
  { email: String
  , name: String
  , keys: Int
  -- TODO: these could be made faster using binary trees sorted by id/index
  , products: List Product
  , productTypes: List ProductType
  , prices: List Price
  , conventions: List Convention }

{-| Creates a new blank user.

    new
-}
new : User
new = User "" "" 0 [] [] [] []
