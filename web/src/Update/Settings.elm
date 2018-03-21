module Update.Settings exposing (update)
import Http
import Json.Decode as Decode
import Json.Encode as Json

import Msg exposing (Msg(..))
import Constants exposing (baseURL)
import Model.Model as Model exposing (Model)
import Model.Settings as Settings
import Model.Page exposing (Page(..), Selector(..))
import Model.ConRequest as ConRequest
import GraphQL exposing (mutation, updateSettings)
import Update.Dialog

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  let
    user = model.user
    settings = user.settings
  in case model.page of
    Settings page -> case msg of
      OpenCurrencySelector ->
        { model | page = Settings { page | currencySelectorOpen = True } } ! []
      SelectCurrency (Just currency) ->
        { model
        | page = Settings
          { page
          | currencySelectorOpen = False
          }
        , user = { user | settings = { settings | currency = currency } }
        } ! []
      SelectCurrency Nothing ->
        { model | page = Settings { page | currencySelectorOpen = False } } ! []
      SettingsChangeOldPassword str -> 
        { model | page = Settings { page | oldPassword = str } } ! []
      SettingsChangeNewPassword str -> 
        { model | page = Settings { page | newPassword = str } } ! []
      SettingsChangeConfirmPassword str -> 
        { model | page = Settings { page | confirmPassword = str } } ! []
      ChangePassword -> 
        if page.newPassword == page.confirmPassword 
        then model ! [changePassword model page.oldPassword page.newPassword ]
        else Update.Dialog.update (ShowErrorMessage "Passwords do not match") model
      DidChangePassword (Ok (ConRequest.Success _)) -> 
        { model | page = Settings { page | oldPassword = "", newPassword = "", confirmPassword = "" } } ! []
      
      DidChangePassword (Ok (ConRequest.Failure msg)) -> Update.Dialog.update (ShowErrorMessage ("Failed to save changed password: " ++ msg)) model
      DidChangePassword (Err _) -> Update.Dialog.update (ShowErrorMessage "Failed to save changed password") model 
      SaveSettings ->
        model ! [ saveSettings model settings ]
      _ -> model ! []
    _ -> model ! []

saveSettings : Model -> Settings.Settings -> Cmd Msg
saveSettings model settings =
  mutation DidSaveSettings (updateSettings settings) model

post : Model -> String -> Http.Body -> Decode.Decoder a -> Http.Request a
post model url body decoder = Debug.log "request"
  Http.request
    { method = "POST"
    , headers = [ Http.header "Authorization" ("Bearer " ++ model.authtoken) ]
    , url = baseURL ++ url
    , body = body
    , expect = Http.expectJson decoder
    , timeout = Nothing
    , withCredentials = False
    }

changePassword : Model -> String -> String -> Cmd Msg
changePassword model old new =
  Http.send DidChangePassword <| post model "/api/auth/change-password"
    (Http.jsonBody <| Json.object
      [ ("old", Json.string old)
      , ("new", Json.string new)
      ]
    )
    (ConRequest.decode <| Decode.succeed ())
