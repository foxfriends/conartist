module Model.Dialog exposing (..)
import Html exposing (Html)

import Model.Convention exposing (MetaConvention)
import Model.Pagination exposing (Pagination)
import Msg exposing (Msg)

type Dialog
  = Error (Html Msg) Msg
  | ChooseConvention (Pagination MetaConvention)
  | Closed Dialog
  | None
