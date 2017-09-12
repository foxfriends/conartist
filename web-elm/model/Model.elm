module Model exposing (Model)
import List exposing (foldl)
import Date exposing (Date)

import Convention exposing (Convention)
import Page exposing (Page)
import User exposing (User)

type alias Model =
  { user: User
  , authtoken : String
  , page: Page
  , now: Date }

isDirty : Model -> Bool
isDirty { user } = foldl (\c -> \p -> p || Convention.isDirty c ) False user.conventions
