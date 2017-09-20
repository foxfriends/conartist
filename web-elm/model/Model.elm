module Model exposing (..)
import List exposing (foldl)
import Date exposing (Date)

import Product
import Convention exposing (Convention)
import Page exposing (Page)
import User exposing (User)

type alias Model =
  { user: User
  , authtoken : String
  , page: Page
  , now: Date
  , sidenav_visible: Bool }

isDirty : Model -> Bool
isDirty { user } = foldl (\c -> \p -> p || Convention.isDirty c ) False user.conventions

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
