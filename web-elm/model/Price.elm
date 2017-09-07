module Price exposing (Price, isDirty)

type alias FullPrice =
  { id: Int
  , type_id: Int
  , product_id: Maybe Int
  , price: Float
  , quantity: Int }

type alias DeletedPrice =
  { id: Int }

type alias NewPrice =
  { type_id: Int
  , product_id: Maybe Int
  , price: Float
  , quantity: Int }

type Price
  = Clean FullPrice
  | Dirty FullPrice
  | New NewPrice
  | Deleted DeletedPrice

isDirty : Price -> Bool
isDirty price = case price of
  Clean _ -> False
  Dirty _ -> True
  New _ -> True
  Deleted _ -> True
