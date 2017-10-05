module Page exposing (..)
import Status exposing (Status(..))

type Page
  = Dashboard
  | Inventory InventoryPageState
  | Pricing PricingPageState
  | Conventions
  | Convention String
  | Settings
  | SignIn SignInPageState

type alias InventoryPageState =
  { current_tab: Int
  , color_picker:
    { open: Bool
    , page: Int } }

type Selector
  = TypeSelector Int
  | ProductSelector Int
  | None

type alias PricingPageState =
  { open_selector : Selector }

type alias SignInPageState =
  { email: String
  , password: String
  , c_email: String
  , c_password: String
  , terms_accepted: Bool
  , is_sign_in: Bool
  , status: Status }

signIn : Page
signIn = SignIn <| SignInPageState "" "" "" "" False True (Success "")

inventory : Page
inventory = Inventory <| InventoryPageState 0 { open = False, page = 0 }

pricing : Page
pricing = Pricing <| PricingPageState None
