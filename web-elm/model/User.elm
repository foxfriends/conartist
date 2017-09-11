module User exposing (User, new, decode)
import Json.Decode as Decode exposing (Decoder)

import Product exposing (Product)
import ProductType exposing (ProductType)
import Price exposing (Price)
import Convention exposing (Convention)


type alias User =
  { email: String
  , keys: Int
  , products: List Product
  , productTypes: List ProductType
  , prices: List Price
  , conventions: List Convention }

decode : Decoder User
decode =
  Decode.map6 User
    (Decode.field "email" Decode.string )
    (Decode.field "keys" Decode.int )
    (Decode.field "products" (Decode.list Product.decode) )
    (Decode.field "types" (Decode.list ProductType.decode))
    (Decode.field "prices" (Decode.list Price.decode) )
    (Decode.field "conventions" (Decode.list Convention.decode) )

new : User
new = User "" 0 [] [] [] []
