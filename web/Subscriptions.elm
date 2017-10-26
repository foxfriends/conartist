module Subscriptions exposing (subscriptions)
import Mouse
import Time
import Date

import Model exposing (Model)
import Msg exposing (Msg(..))
import Files
import LocalStorage

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch
    [ LocalStorage.retrieve LSRetrive
    , Files.didRead DidFileRead
    , Files.didWrite DidFileWrite
    , Mouse.moves MouseMove
    , Time.every Time.minute (Date.fromTime >> SetDate)]
