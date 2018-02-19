module Update.Settings exposing (update)

import Msg exposing (Msg(..))
import Model.Model as Model exposing (Model)
import Model.Settings as Settings
import Model.Page exposing (Page(..), Selector(..))
import GraphQL exposing (mutation, updateSettings)

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
      SaveSettings ->
        model ! [ saveSettings model settings ]
      _ -> model ! []
    _ -> model ! []

saveSettings : Model -> Settings.Settings -> Cmd Msg
saveSettings model settings =
  mutation DidSaveSettings (updateSettings settings) model
