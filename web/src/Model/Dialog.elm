module Model.Dialog exposing (..)
import Html exposing (Html)

import Model.Convention exposing (MetaConvention)
import Model.Pagination exposing (Pagination)
import Msg exposing (Msg)

{-| Types of modal dialogs that are available to the app.
-}
type Dialog
  = Error (Html Msg) Msg
  | ChooseConvention (Pagination MetaConvention)
  | Closed Dialog
  | None
