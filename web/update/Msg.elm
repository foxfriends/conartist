module Msg exposing (Msg(..), TabStatus)
import Http
import GraphQL.Client.Http exposing (Error)
import Date exposing (Date)
import Navigation exposing (Location)

import ConRequest exposing (ConRequest, Pagination)
import Product exposing (FullProduct)
import ProductType exposing (FullType)
import Price exposing (FullPrice)
import Convention exposing (MetaConvention, FullConvention)
import User exposing (User)

type alias TabStatus =
  { current: Int
  , width: Float }

type Msg
  -- sign in
    -- TODO: user better names for the sign in form messages
  = Email String
  | CEmail String
  | Password String
  | CPassword String
  | Name String
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
  | OpenChooseConvention
  | AddConvention MetaConvention
  | AddedConvention (Result Http.Error (ConRequest ()))
  -- inventory
  | ChangeInventoryTab TabStatus
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
  | SortInventoryTable Int
  | ReadInventoryCSV
  | WriteInventoryCSV
  -- pricing
  | PricingAdd
  | PricingProductType Int (Maybe Int)
  | PricingProduct Int (Maybe Int)
  | PricingQuantity Int String
  | PricingPrice Int String
  | PricingRemove Int
  | SelectProductType Int
  | SelectProduct Int
  | SortPricingTable Int
  | ReadPricingCSV
  | WritePricingCSV
  -- conventions
  | ChangeConventionTab TabStatus
  | SortConProductsTable Int
  | SortConPricesTable Int
  | SortConRecordsTable Int
  -- loading
  | DidLoadUser (Result Error User)
  | DidLoadUserThen (Cmd Msg) (Result Error User)
  | DidLoadChooseConvention (Result Error (Pagination MetaConvention))
  | DidLoadConvention (Result Error FullConvention)
  -- saving
  | SaveProducts
  | SavePrices
  | SaveTypes
  | Save
  | SavedProducts (Result Http.Error (ConRequest (List FullProduct)))
  | SavedPrices (Result Http.Error (ConRequest (List FullPrice)))
  | UpdatedTypes (Result Error (List (String, FullType)))
  | CreatedTypes (Result Error (List (String, FullType)))
  -- localStorage
  | LSRetrive (String, Maybe String)
  -- files
  | DidFileRead (String, Maybe String)
  | DidFileWrite (String, Maybe String)
  -- navigation
  | DoNav String
  | DidNav Location
  | SetDate Date
  | ToggleSidenav
  | Reauthorized (Result Http.Error (ConRequest String))
  -- dialog
  | CloseDialog
  | EmptyDialog
  | DialogPage Int
  | ShowErrorMessage String
  -- other
  | Batch (List Msg)
  | Ignore
