module Model.Model exposing (..)
{-| The entire ConArtist web dashboard data model. Acts as the single source of truth for the app at
any given moment.

# Definition
@docs Model
-}
import List exposing (foldl)
import Date exposing (Date)
import Navigation exposing (Location)
import Mouse

import Model.Product as Product
import Model.Price as Price
import Model.ProductType as ProductType
import Model.Convention as Convention
import Model.Page exposing (Page)
import Model.Dialog exposing (Dialog)
import Model.User exposing (User)
import Model.Money exposing (Currency)

{-| The actual ConArtist data model. Contains all information required to render the app.
-}
type alias Model =
  { user: User
  , authtoken : String
  , page: Page
  , dialog: Dialog
  , now: Date
  , showDiscontinued: Bool
  , sidenavVisible: Bool
  , location: Maybe Location
  , mouse: Mouse.Position
  }

{-| Determines whether any part of the Model is currently dirty (modified since the last time it was
saved) or not.

    isDirty model
-}
isDirty : Model -> Bool
isDirty { user } =
      foldl (Convention.isDirty >> (||))  False user.conventions
  ||  foldl (Product.isDirty >> (||))     False user.products
  ||  foldl (Price.isDirty >> (||))       False user.prices
  ||  foldl (ProductType.isDirty >> (||)) False user.productTypes

cleanPrices : List (String, Price.CondensedPrice) -> Model -> Model
cleanPrices updates model =
  let
    user = model.user
    prices = user.prices
  in
    { model
    | user =
      { user
      | prices = Price.reindex <| Price.clean updates prices
      }
    }

removeDeletedPrices : Model -> Model
removeDeletedPrices model =
  let
    user = model.user
    prices = user.prices
  in
    { model
    | user =
      { user
      | prices = Price.reindex <| List.filter (not << Price.deleted) prices } }

cleanProducts : List (String, Product.FullProduct) -> Model -> Model
cleanProducts updates model =
  let
    user = model.user
    products = user.products
    prices = user.prices
  in
    { model
    | user =
      { user
      | products = Product.clean updates products
      , prices = Price.fillNewProducts (List.map Tuple.second updates) products prices } }

cleanTypes : List (String, ProductType.FullType) -> Model -> Model
cleanTypes updates model =
  let
    user = model.user
    types = user.productTypes
    products = user.products
    prices = user.prices
  in
    { model
    | user =
      { user
      | productTypes = ProductType.clean updates types
      , products = Product.fillNewTypes (List.map Tuple.second updates) types products
      , prices = Price.fillNewTypes (List.map Tuple.second updates) types prices } }
