module Join exposing (..)
import Product exposing (FullProduct)
import ProductType exposing (FullType)
import List_

type alias ProductWithType =
  { id: Int
  , name: String
  , type_: FullType
  , quantity: Int
  , discontinued: Bool}

productsWithTypes : List FullType -> List FullProduct -> List ProductWithType
productsWithTypes types products =
  List.filterMap (\p -> Maybe.map (joinProductToType p) <| List_.find (\t -> p.type_id == t.id) types) products

joinProductToType : FullProduct -> FullType -> ProductWithType
joinProductToType { id, name, quantity, discontinued } typ = ProductWithType id name typ quantity discontinued
