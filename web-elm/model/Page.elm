module Page exposing (..)
import Status exposing (Status(..))
import Msg exposing (TabStatus)
import Convention

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
    , page: Int } }

type alias ConventionPageState =
  { current_tab: TabStatus
  , convention: Maybe Convention.Convention }

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

-- TODO: TabStatus default dimensions should be revisited...
inventory : Page
inventory = Inventory <| InventoryPageState (TabStatus 0 150) { open = False, page = 0 }

pricing : Page
pricing = Pricing <| PricingPageState None

convention : Maybe Convention.Convention -> Page
convention con = Convention (ConventionPageState (TabStatus 0 150) con)
