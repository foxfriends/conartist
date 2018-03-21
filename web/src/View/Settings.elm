module View.Settings exposing (view)
import Html exposing (Html, div, span, text)
import Html.Attributes exposing (class, type_)
import Html.Events exposing (onInput)

import Msg exposing (Msg(..))
import Model.Model exposing (Model)
import Model.Settings exposing (Settings)
import Model.Page exposing (SettingsPageState)
import Model.Money as Money
import View.Attributes exposing (onInteract)
import View.Card exposing (..)
import View.Fancy as Fancy

view : Model -> Settings -> SettingsPageState -> Html Msg
view model settings state =
  div
    [ class "settings" ]
    [ cardWithHeader
      [ text "Locale settings" ]
      [ class "settings__card" ]
      [ Fancy.select
          OpenCurrencySelector
          SelectCurrency
          (Maybe.map Money.currencyString >> Maybe.withDefault "")
          Money.allCurrencies
          (Just settings.currency)
          state.currencySelectorOpen
      ]
      [ Fancy.button Fancy.Primary "Save" (onInteract SaveSettings Ignore) ]
    , cardWithHeader
      [ text "Change password" ]
      [ class "settings__card" ]
      [ Fancy.input "Current password" state.oldPassword [] [type_ "password", onInput SettingsChangeOldPassword] 
      , Fancy.input "New password" state.newPassword [] [type_ "password", onInput SettingsChangeNewPassword] 
      , Fancy.input "Confirm password" state.confirmPassword [] [type_ "password", onInput SettingsChangeConfirmPassword] 
      ]
      [ Fancy.button Fancy.Primary "Save" (onInteract ChangePassword Ignore) ]
    ]
