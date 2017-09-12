module Msg exposing (Msg(..))
import Http
import Date exposing (Date)
import Navigation exposing (Location)

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
  | DoSignOut
  | DidSignIn (Result Http.Error (ConRequest String))
  | DoCreateAccount
  | DidCreateAccount (Result Http.Error (ConRequest ()))
  | DidCheckExistingEmail (Result Http.Error (ConRequest Bool))
  -- dashboard
  | OpenKeyPurchase
  | OpenConSignUp
  -- loading
  | DidLoadUser (Result Http.Error (ConRequest User))
  -- localStorage
  | LSRetrive (String, Maybe String)
  -- Navigation
  | DoNav String
  | DidNav Location
  | SetDate Date
