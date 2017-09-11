module Load exposing (update, user)
import Http

import Model exposing (Model)
import Msg exposing (Msg(..))
import User
import ConRequest exposing (ConRequest(..))

update : Msg -> Model -> Maybe (Model, Cmd Msg)
update msg model = case msg of
  DidLoadUser (Ok (Success user)) -> Just ({ model | user = Just user }, Cmd.none)
  _ -> Nothing

user : Model -> Cmd Msg
user model =
  Http.send DidLoadUser <| Http.request
    { method = "Get"
    , headers = [ Http.header "Authorization" ("Bearer " ++ model.authtoken) ]
    , url = "/api/user"
    , body = Http.emptyBody
    , expect = Http.expectJson (ConRequest.decode <| User.decode )
    , timeout = Nothing
    , withCredentials = False }
