module Model exposing (Model, init)
import List exposing (foldl)

import Msg exposing (Msg)
import Convention exposing (Convention)
import Page exposing (Page)
import User exposing (User)

type alias Model =
  { user: Maybe User
  , authtoken : String
  , page: Page }

init : (Model, Cmd Msg)
init =
  ( { user = Nothing
    , authtoken = ""
    , page = Page.signIn }
  , Cmd.none )

isDirty : Model -> Bool
isDirty { user } = case user of
  Just user -> foldl (\c -> \p -> p || Convention.isDirty c ) False user.conventions
  Nothing -> False
