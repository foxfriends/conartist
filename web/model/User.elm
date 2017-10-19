module User exposing (User, new)

import Product exposing (Product)
import ProductType exposing (ProductType)
import Price exposing (Price)
import Convention exposing (Convention)


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
