module Subscriptions exposing (subscriptions)
import Model exposing (Model)
import Msg exposing (Msg(..))
import LocalStorage

subscriptions : Model -> Sub Msg
subscriptions model =
  LocalStorage.retrieve LSRetrive
