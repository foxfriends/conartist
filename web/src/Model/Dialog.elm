module Model.Dialog exposing (..)
import Model.Convention exposing (MetaConvention)
import Model.Pagination exposing (Pagination)

type Dialog
  = Error String
  | ChooseConvention (Pagination MetaConvention)
  | Closed Dialog
  | None
