module Update.Settings exposing (update)

import Msg exposing (Msg(..))
import Model.Model as Model exposing (Model)
import Model.Page exposing (Page(..), Selector(..))

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  let
    settings = model.settings
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
        , settings = { settings | currency = currency }
        } ! []
      SelectCurrency Nothing ->
        { model | page = Settings { page | currencySelectorOpen = False } } ! []
      SaveSettings ->
        model ! [ saveSettings settings ]
      _ -> model ! []
    _ -> model ! []

saveSettings : Model.Settings -> Cmd Msg
saveSettings settings = Cmd.none
-- TODO: this requires an API change
