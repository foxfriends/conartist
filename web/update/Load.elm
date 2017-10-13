module Load exposing (update, user, userAndThen)
import Http

import Model exposing (Model)
import Msg exposing (Msg(..))
import ConRequest exposing (ConRequest(..))
import Dialog exposing (Dialog(..))
import Convention exposing (asMeta, Convention(Full))
import User exposing (User)
import List_

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  DidLoadUser (Ok (Success user)) -> { model | user = user } ! []
  DidLoadUserThen after (Ok (Success user)) -> { model | user = user } ! []
  DidLoadChooseConvention (Ok (Success { data, page, pages })) ->
    case model.dialog of
      ChooseConvention _ -> { model | dialog = ChooseConvention { cons = data, pages = pages, page = page } } ! []
      _ -> model ! []
  DidLoadConvention (Ok (Success con)) ->
    let user = model.user in
    let conventions = List_.updateAt (asMeta >> .code >> (==) con.code) (always <| Full con) user.conventions in
      { model | user = { user | conventions = conventions } } ! []
  _ -> model ! []

user : Model -> Cmd Msg
user = Http.send DidLoadUser << userReq

userAndThen : Cmd Msg -> Model -> Cmd Msg
userAndThen after = Http.send (DidLoadUserThen after) << userReq

userReq : Model -> Http.Request (ConRequest User)
userReq model =
  Http.request
    { method = "Get"
    , headers = [ Http.header "Authorization" ("Bearer " ++ model.authtoken) ]
    , url = "/api/user"
    , body = Http.emptyBody
    , expect = Http.expectJson (ConRequest.decode User.decode)
    , timeout = Nothing
    , withCredentials = False }
