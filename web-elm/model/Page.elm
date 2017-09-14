module Page exposing (..)
import Status exposing (Status(..))

type Page
  = Dashboard
  | Inventory InventoryPageState
  | Pricing
  | Conventions
  | Convention String
  | SignIn SignInPageState

type alias InventoryPageState =
  { current_tab: Int }

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
inventory = Inventory <| InventoryPageState 0
