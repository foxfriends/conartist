module Load exposing (update, user)
import Http

import Model exposing (Model)
import Msg exposing (Msg(..))
import ConRequest exposing (ConRequest(..))
import User
import Dialog exposing (Dialog(..))

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  DidLoadUser (Ok (Success user)) -> ({ model | user = user }, Cmd.none)
  DidLoadChooseConvention (Ok (Success { data, page, pages })) ->
    case model.dialog of
      ChooseConvention _ -> ({ model | dialog = ChooseConvention { cons = data, pages = pages, page = page } }, Cmd.none)
      _ -> (model, Cmd.none)
  _ -> (model, Cmd.none)

user : Model -> Cmd Msg
user model =
  Http.send DidLoadUser <| Http.request
    { method = "Get"
    , headers = [ Http.header "Authorization" ("Bearer " ++ model.authtoken) ]
    , url = "/api/user"
    , body = Http.emptyBody
    , expect = Http.expectJson (ConRequest.decode User.decode)
    , timeout = Nothing
    , withCredentials = False }
