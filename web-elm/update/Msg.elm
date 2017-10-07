module Msg exposing (Msg(..))
import Http
import Date exposing (Date)
import Navigation exposing (Location)

import ConRequest exposing (ConRequest)
import Product exposing (FullProduct)
import ProductType exposing (FullType)
import Price exposing (FullPrice)
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
  | ColorPickerPage Int
  | ColorPickerOpen
  | ColorPickerClose
  | NewProductType
  | ProductTypeName Int String
  | ProductTypeColor Int Int
  | ProductTypeDiscontinued Int
  | NewProduct
  | ProductName Int Int String
  | ProductQuantity Int Int String
  | ProductDiscontinued Int Int
  -- pricing
  | PricingAdd
  | PricingProductType Int (Maybe Int)
  | PricingProduct Int (Maybe Int)
  | PricingQuantity Int String
  | PricingPrice Int String
  | PricingRemove Int
  | SelectProductType Int
  | SelectProduct Int
  -- loading
  | DidLoadUser (Result Http.Error (ConRequest User))
  -- saving
  | SaveProducts
  | SavePrices
  | SaveTypes
  | Save
  | SavedProducts (Result Http.Error (ConRequest (List FullProduct)))
  | SavedPrices (Result Http.Error (ConRequest (List FullPrice)))
  | SavedTypes (Result Http.Error (ConRequest (List FullType)))
  -- localStorage
  | LSRetrive (String, Maybe String)
  -- navigation
  | DoNav String
  | DidNav Location
  | SetDate Date
  | ToggleSidenav
  | CloseDialog
  | EmptyDialog
  | ShowErrorMessage String
  -- other
  | Batch (List Msg)
  | Ignore
