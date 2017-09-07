module Model exposing (Model, model)
import List exposing (foldl)
import Convention exposing (Convention)

type alias UserInfo =
  { email: String
  , authtoken: String }

type alias Model =
  { userInfo: Maybe UserInfo
  , conventions: List Convention }

model : Model
model =
  { userInfo = Nothing
  , conventions = [] }

isDirty : Model -> Bool
isDirty model =
  foldl (\c -> \p -> p || Convention.isDirty c ) False model.conventions
