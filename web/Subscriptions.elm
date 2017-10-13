module Subscriptions exposing (subscriptions)
import Model exposing (Model)
import Msg exposing (Msg(..))
import Files
import LocalStorage

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch
    [ LocalStorage.retrieve LSRetrive
    , Files.didRead DidFileRead
    , Files.didWrite DidFileWrite ]
