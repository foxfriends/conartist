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
  _ -> model ! []

user : Model -> Cmd Msg
user = query DidLoadUser getUser

userLoadError : String -> Html msg
userLoadError err =
  div []
    [ div []
      [ text
        """
        Something went wrong and your account could not be found! Concerned? Send this
        below to the developers:
        """ ]
    , div [] [ text err ] ]
