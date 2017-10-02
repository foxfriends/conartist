module Dialog exposing (..)

type Dialog
  = Error String
  | ChooseConvention
  | Closed Dialog
  | None
