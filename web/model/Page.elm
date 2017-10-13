module Page exposing (..)
import Status exposing (Status(..))
import Msg exposing (TabStatus)
import List exposing (repeat)

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
  { email: String
  , password: String
  , c_email: String
  , c_password: String
  , terms_accepted: Bool
  , is_sign_in: Bool
  , status: Status }

signIn : Page
signIn = SignIn <| SignInPageState "" "" "" "" False True (Success "")

sort : Int -> List Order
sort = flip repeat EQ

-- TODO: TabStatus default dimensions should be revisited...
inventory : Page
inventory = Inventory <| InventoryPageState (TabStatus 0 150) { open = False, page = 0 } (sort 3)

pricing : Page
pricing = Pricing <| PricingPageState None (sort 5)

convention : String -> Page
convention con = Convention <| ConventionPageState (TabStatus 0 150) con (sort 3) (sort 4) (sort 5)
