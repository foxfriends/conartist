module ProductType exposing (..)
import Json.Decode as Decode exposing (Decoder)

type alias NewType =
  { localId: Int
  , name: String
  , color: Int }

type alias FullType =
  { id: Int
  , name: String
  , color: Int
  , discontinued: Bool }

type ProductType
  = Clean FullType
  | Dirty FullType
  | New NewType

isDirty : ProductType -> Bool
isDirty pt = case pt of
  Clean _ -> False
  Dirty _ -> True
  New   _ -> True

decode : Decoder ProductType
decode = Decode.map (\a -> Clean a) <|
  Decode.map4 FullType
    (Decode.field "id" Decode.int)
    (Decode.field "name" Decode.string)
    (Decode.field "color" Decode.int)
    (Decode.field "discontinued" Decode.bool)

normalize : ProductType -> FullType
normalize t = case t of
  Clean t -> t
  Dirty t -> t
  New   t -> FullType -t.localId t.name t.color False

new : Int -> ProductType
new id = New (NewType id ("New Type " ++ toString id) 0xFFFFFF)
