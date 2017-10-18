module Page exposing (..)
import Status exposing (Status(..))
import Msg exposing (TabStatus)
import List exposing (repeat)
import Validation exposing (Validation(..), valueOf, invalidate, empty, isValid)

type Page
  = Loading
  | Dashboard
  | Inventory InventoryPageState
  | Pricing PricingPageState
  | Conventions
  | Convention ConventionPageState
  | Settings
  | SignIn SignInPageState

type alias InventoryPageState =
  { current_tab: TabStatus
  , color_picker:
    { open: Bool
    , page: Int }
  , table_sort: List Order }

type alias ConventionPageState =
  { current_tab: TabStatus
  , convention: String
  , product_sort: List Order
  , price_sort: List Order
  , record_sort: List Order }

type Selector
  = TypeSelector Int
  | ProductSelector Int
  | None

type alias PricingPageState =
  { open_selector : Selector
  , table_sort: List Order }

type alias SignInPageState =
  { email: Validation String
  , password: Validation String
  , c_email: Validation String
  , c_password: Validation String
  , name: Validation String
  , terms_accepted: Validation Bool
  , is_sign_in: Bool
  , status: Status }

signIn : Page
signIn = SignIn <| validateSignInForm <| SignInPageState (Valid "") (Valid "") (Valid "") (Valid "") (Valid "") (Valid False) True (Success "")

validateSignInForm : SignInPageState -> SignInPageState
validateSignInForm page =
  let { email, c_email, password, c_password, name, terms_accepted, is_sign_in } = page in
    if is_sign_in then
      { page
      | email =
          if valueOf email == "" then
            empty email "Your email or password is incorrect"
          else email
      , password =
          if valueOf password == "" then
            empty password "Your email or password is incorrect"
          else password
      }
    else
      { page
      | email =
          if valueOf email == "" then
            empty email "Email must not be blank"
          else email
      , c_email =
          if not <| valueOf c_email == valueOf email then
            invalidate c_email "Emails do not match"
          else if valueOf c_email == "" then
            empty c_email ""
          else c_email
      , password =
          if valueOf password == "" then
            empty password "Password must not be blank"
          else password
      , c_password =
          if not <| valueOf c_password == valueOf password then
            invalidate c_password "Passwords do not match"
          else if valueOf c_password == "" then
            empty c_password ""
          else c_password
      , name =
          if valueOf name == "" then
            empty name "Please provide a name. Your artist handle is recommended"
          else name
      , terms_accepted =
          if not <| valueOf terms_accepted then
            empty terms_accepted "Please accept the terms and conditions!"
          else terms_accepted
      }

sort : Int -> List Order
sort = flip repeat EQ

-- TODO: TabStatus default dimensions should be revisited...
inventory : Page
inventory = Inventory <| InventoryPageState (TabStatus 0 150) { open = False, page = 0 } (sort 3)

pricing : Page
pricing = Pricing <| PricingPageState None (sort 5)

convention : String -> Page
convention con = Convention <| ConventionPageState (TabStatus 0 150) con (sort 3) (sort 4) (sort 5)
