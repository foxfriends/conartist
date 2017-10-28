module Update.Load exposing (update, user, userAndThen)

import GraphQL exposing (query, getUser)
import Model.Model exposing (Model)
import Model.Dialog exposing (Dialog(..))
import Model.Convention exposing (asMeta, Convention(Full))
import Msg exposing (Msg(..))
import Util.List as List

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  DidLoadUser (Ok user) -> { model | user = user } ! []
  DidLoadUserThen after (Ok user) -> { model | user = user } ! [ after ]
  DidLoadChooseConvention (Ok { data, page, pages }) ->
    case model.dialog of
      ChooseConvention _ -> { model | dialog = ChooseConvention { data = data, pages = pages, page = page } } ! []
      _ -> model ! []
  DidLoadConvention (Ok con) ->
    let
      user = model.user
      conventions = List.updateAt (asMeta >> .code >> (==) con.code) (always <| Full con) user.conventions
    in
      { model | user = { user | conventions = conventions } } ! []
  _ -> model ! []

user : Model -> Cmd Msg
user = query DidLoadUser getUser

userAndThen : Cmd Msg -> Model -> Cmd Msg
userAndThen = DidLoadUserThen >> flip query getUser
