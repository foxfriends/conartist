module Msg exposing (Msg(..))
import Http

import ConRequest exposing (ConRequest)
import User exposing (User)

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
  | DoCreateAccount
  | DidCreateAccount (Result Http.Error (ConRequest ()))
  | DidCheckExistingEmail (Result Http.Error (ConRequest Bool))
  -- dashboard
  | OpenKeyPurchase
  | OpenConSignUp
  -- loading
  | DidLoadUser (Result Http.Error (ConRequest User))
