port module Ports.LocalStorage exposing (..)
{-| Ports to access the localStorage of the browser.
-}
port set : (String, String) -> Cmd msg
port remove : String -> Cmd msg
port get : String -> Cmd msg

port retrieve : ((String, Maybe String) -> msg) -> Sub msg
