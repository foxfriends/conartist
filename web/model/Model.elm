module Model exposing (..)
import List exposing (foldl)
import Date exposing (Date)
import Navigation exposing (Location)

import Product
import Price
import ProductType
import Convention
import Page exposing (Page)
import Dialog exposing (Dialog)
import User exposing (User)

type alias Model =
  { user: User
  , authtoken : String
  , page: Page
  , dialog: Dialog
  , now: Date
  , show_discontinued: Bool
  , sidenav_visible: Bool
  , location: Maybe Location }

isDirty : Model -> Bool
isDirty { user } =
      foldl (Convention.isDirty >> (||))  False user.conventions
  ||  foldl (Product.isDirty >> (||))     False user.products
  ||  foldl (Price.isDirty >> (||))       False user.prices
  ||  foldl (ProductType.isDirty >> (||)) False user.productTypes

cleanPrices : List Price.FullPrice -> Model -> Model
cleanPrices updates model =
  let
    user = model.user
    prices = user.prices
  in
    { model
    | user =
      { user
      | prices = Price.clean updates prices } }

cleanProducts : List Product.FullProduct -> Model -> Model
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
      , prices = Price.fillNewProducts updates products prices } }

cleanTypes : List ProductType.FullType -> Model -> Model
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
      , products = Product.fillNewTypes updates types products
      , prices = Price.fillNewTypes updates types prices } }

validateRequest : Model -> Result String Model
validateRequest model =
  ProductType.validateRequest model.user.productTypes
    |> Result.andThen (always <| Product.validateRequest model.user.productTypes model.user.products)
    |> Result.andThen (always <| Price.validateRequest model.user.prices model.user.productTypes model.user.products)
    |> Result.map (always <| model)
