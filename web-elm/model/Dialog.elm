module Dialog exposing (..)
import Convention exposing (MetaConvention)

type Dialog
  = Error String
  | ChooseConvention ChooseConvention_
  | Closed Dialog
  | None

type alias ChooseConvention_ =
  { cons: (List MetaConvention)
  , pages: Int
  , page: Int }
