module Model.User exposing (User, new)

import Model.Product exposing (Product)
import Model.ProductType exposing (ProductType)
import Model.Price exposing (Price)
import Model.Convention exposing (Convention)

type alias User =
  { email: String
  , name: String
  , keys: Int
  -- TODO: these could be made faster using binary trees sorted by id/index
  , products: List Product
  , productTypes: List ProductType
  , prices: List Price
  , conventions: List Convention }

new : User
new = User "" "" 0 [] [] [] []
