module Msg exposing (Msg(..))

type Msg
  -- sign in
  = Email String
  | CEmail String
  | Password String
  | CPassword String
  | ToggleTerms
  | ToggleSignIn
  | DoSignIn
