module User exposing (User, new, decode)
import Json.Decode as Decode exposing (Decoder)

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

decode : Decoder User
decode =
  Decode.map7 User
    (Decode.field "email" Decode.string)
    (Decode.field "name" Decode.string)
    (Decode.field "keys" Decode.int)
    (Decode.field "products" (Decode.map (List.map Product.Clean) (Decode.list Product.decode)))
    (Decode.field "types" (Decode.map (List.map ProductType.Clean) (Decode.list ProductType.decode)))
    (Decode.field "prices" (Decode.map (List.map Price.Clean) (Decode.list Price.decode)))
    (Decode.field "conventions" (Decode.map (List.map Convention.Meta) (Decode.list Convention.decode)))

new : User
new = User "" "" 0 [] [] [] []
