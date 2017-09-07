module ProductType exposing (ProductType, isDirty)

type alias NewType =
  { name: String
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
