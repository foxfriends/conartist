module Page exposing (..)
import Status exposing (Status(..))

type Page
  = Dashboard
  | Inventory
  | Pricing
  | Conventions
  | Convention String
  | SignIn SignInPageState

type alias SignInPageState =
  { email: String
  , password: String
  , c_email: String
  , c_password: String
  , terms_accepted: Bool
  , is_sign_in: Bool
  , status: Status }

signIn : Page
signIn = SignIn { email = "", password = "", c_email = "", c_password = "", terms_accepted = False, is_sign_in = True, status = Success "" }
