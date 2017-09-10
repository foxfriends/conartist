module Msg exposing (Msg(..))
import Http
import ConRequest exposing (ConRequest)

type Msg
  -- sign in
  = Email String
  | CEmail String
  | Password String
  | CPassword String
  | ToggleTerms
  | ToggleSignIn
  | DoSignIn
  | DidSignIn (Result Http.Error (ConRequest String))
