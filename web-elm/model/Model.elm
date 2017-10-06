module Model exposing (..)
import List exposing (foldl)
import Date exposing (Date)

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
  , sidenav_visible: Bool }

isDirty : Model -> Bool
isDirty { user } =
      foldl (\c -> \p -> p || Convention.isDirty c )  False user.conventions
  ||  foldl (\c -> \p -> p || Product.isDirty c )     False user.products
  ||  foldl (\c -> \p -> p || Price.isDirty c )       False user.prices
  ||  foldl (\c -> \p -> p || ProductType.isDirty c ) False user.productTypes

cleanPrices : List Price.FullPrice -> Model -> Model
cleanPrices updates model =
  let user = model.user in
  let prices = user.prices in
    { model
    | user =
      { user
      | prices = Price.clean updates prices } }

cleanProducts : List Product.FullProduct -> Model -> Model
cleanProducts updates model =
  let user = model.user in
  let products = user.products in
  let prices = user.prices in
    { model
    | user =
      { user
      | products = Product.clean updates products
      , prices = Price.fillNewProducts updates products prices } }

cleanTypes : List ProductType.FullType -> Model -> Model
cleanTypes updates model =
  let user = model.user in
  let types = user.productTypes in
  let products = user.products in
  let prices = user.prices in
    { model
    | user =
      { user
      | productTypes = ProductType.clean updates types
      , products = Product.fillNewTypes updates types products
      , prices = Price.fillNewTypes updates types prices } }

validateRequest : Model -> Result String Model
validateRequest model =
  ProductType.validateRequest model.user.productTypes
    |> Result.andThen (\_ -> Product.validateRequest model.user.productTypes model.user.products)
    |> Result.andThen (\_ -> Price.validateRequest model.user.prices model.user.productTypes model.user.products)
    |> Result.map (\_ -> model)
