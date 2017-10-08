module Dialog exposing (..)
import Convention exposing (MetaConvention)

type Dialog
  = Error String
  | ChooseConvention (List MetaConvention) Int Int
  | Loading Dialog
  | Closed Dialog
  | None
