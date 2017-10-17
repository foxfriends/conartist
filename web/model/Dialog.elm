module Dialog exposing (..)
import Convention exposing (MetaConvention)
import Pagination exposing (Pagination)

type Dialog
  = Error String
  | ChooseConvention (Pagination MetaConvention)
  | Closed Dialog
  | None
