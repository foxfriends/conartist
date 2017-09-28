module Model exposing (..)
import List exposing (foldl)
import Date exposing (Date)

import Product
import Price
import ProductType
import Convention
import Page exposing (Page)
import User exposing (User)

type alias Model =
  { user: User
  , authtoken : String
  , page: Page
  , now: Date
  , sidenav_visible: Bool }

isDirty : Model -> Bool
isDirty { user } =
      foldl (\c -> \p -> p || Convention.isDirty c )  False user.conventions
  ||  foldl (\c -> \p -> p || Product.isDirty c )     False user.products
  ||  foldl (\c -> \p -> p || Price.isDirty c )       False user.prices
  ||  foldl (\c -> \p -> p || ProductType.isDirty c ) False user.productTypes

clean : a -> Model -> Model
clean updates model = model

cleanProducts : List Product.FullProduct -> Model -> Model
cleanProducts updates model =
  let user = model.user in
  let products = user.products in
    { model
    | user =
      { user
      | products = Product.clean updates products } }

cleanTypes : List ProductType.FullType -> Model -> Model
cleanTypes updates model =
  let user = model.user in
  let types = user.productTypes in
  let products = user.products in
    { model
    | user =
      { user
      | productTypes = ProductType.clean updates types
      , products = Product.fillNewTypes updates types products } }
