module Model exposing (Model, init)
import List exposing (foldl)
import Msg exposing (Msg)
import Convention exposing (Convention)
import Page exposing (Page)
import User exposing (User)

type alias Model =
  { user: Maybe User
  , page: Page
  , conventions: List Convention }

init : (Model, Cmd Msg)
init =
  ( { user = Nothing
    , page = Page.signIn
    , conventions = [] }
  , Cmd.none )

isDirty : Model -> Bool
isDirty model =
  foldl (\c -> \p -> p || Convention.isDirty c ) False model.conventions
