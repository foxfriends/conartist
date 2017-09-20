module Msg exposing (Msg(..))
import Http
import Date exposing (Date)
import Navigation exposing (Location)

import ConRequest exposing (ConRequest)
import Product
import ProductType exposing (ProductType)
import Price exposing (Price)
import User exposing (User)

type Msg
  -- sign in
  = Email String
  | CEmail String
  | Password String
  | CPassword String
  | Terms Bool
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
  -- inventory
  | ChangeInventoryTab Int
  | ProductName Int String
  | ProductQuantity Int String
  | ToggleDiscontinued Int
  -- loading
  | DidLoadUser (Result Http.Error (ConRequest User))
  -- saving
  | SaveProducts
  | SavePrices
  | SaveTypes
  | SavedProducts (Result Http.Error (ConRequest (List Product.FullProduct)))
  | SavedPrices (Result Http.Error (ConRequest (List Price)))
  | SavedTypes (Result Http.Error (ConRequest (List ProductType)))
  -- localStorage
  | LSRetrive (String, Maybe String)
  -- navigation
  | DoNav String
  | DidNav Location
  | SetDate Date
  | ToggleSidenav
  -- other
  | Batch (List Msg)
