module View.Settings exposing (view)
import Html exposing (Html, div, span, text)
import Html.Attributes exposing (class)

import Msg exposing (Msg(..))
import Model.Model exposing (Model, Settings)
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
    ]
