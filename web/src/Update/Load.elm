module Update.Load exposing (update, user)
import Html exposing (Html, text, div)

import GraphQL exposing (query, getUser)
import Model.Model exposing (Model)
import Model.Dialog exposing (Dialog(..))
import Model.Convention exposing (asMeta, Convention(Full))
import Msg exposing (Msg(..))
import Util.List as List
import Update.Dialog

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  DidLoadUser (Ok user) -> { model | user = user } ! []
  DidLoadUser (Err err) -> Update.Dialog.update (ShowErrorMessageComplex (userLoadError (toString err)) DoSignOut) model
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
  DidLoadConvention (Err err) ->
    Update.Dialog.update (ShowErrorMessageComplex (fillConError (toString err)) Ignore) model
  _ -> model ! []

user : Model -> Cmd Msg
user = query DidLoadUser getUser

-- TODO: automatically send the debug notes to the developers when the error
--       dialog is triggered. On the server side is more likely the more useful
--       place to do it. Probably just do this after getting into production
--       though...

userLoadError : String -> Html msg
userLoadError = Update.Dialog.errorWithMsg
  """
  Something went wrong and your account could not be found! Concerned? Send this
  below to the developers:
  """

fillConError : String -> Html msg
fillConError = Update.Dialog.errorWithMsg
  """
  Something went wrong and this convention could not be loaded! Concerned? Send this
  below to the developers:
  """
