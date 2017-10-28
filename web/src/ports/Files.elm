port module Files exposing (..)

port read : String -> Cmd msg
port write : (String, String) -> Cmd msg

port didRead : ((String, Maybe String) -> msg) -> Sub msg
port didWrite : ((String, Maybe String) -> msg) -> Sub msg
