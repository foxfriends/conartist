module View.Chart.Settings exposing (view, button)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)

import Model.Model exposing (Model)
import Model.ProductType as ProductType
import Model.Convention as Convention
import Model.Page exposing (ConventionPageState, ChartSettingsPage(..))
import View.Fancy as Fancy exposing (ButtonStyle(..))
import Msg exposing (Msg(..))
import Util.List as List

button : msg -> Html msg
button click =
  Fancy.button Icon "settings" [ class "chart__settings-button", onClick click ]

view : Model -> ConventionPageState -> Html Msg
view model page =
  div [ class "chart__settings" ] <|
    case page.open_settings of
      Just (InventorySettings s) ->
        let
          types =
            List.find (Convention.asMeta >> .code >> (==) page.convention) model.user.conventions
              |> Maybe.andThen Convention.asFull
              |> Maybe.map .productTypes
              |> Maybe.withDefault model.user.productTypes
              |> List.map ProductType.normalize
        in
          [ text "Product Type"
          , div [ class "chart__selector" ]
            [ Fancy.select
                InventoryChartSelectType
                InventoryChartType
                (\x -> case x of
                  Just x ->
                    types
                      |> List.find (.id >> (==) x)
                      |> Maybe.map .name
                      |> Maybe.withDefault "Choose a type"
                  Nothing -> "Choose a type")
                ( types
                  |> (if model.show_discontinued then identity else List.filter (not << .discontinued))
                  |> List.map .id )
                page.chart_settings.inventory.product_type
                s.typeSelectorOpen ] ]
      _ -> [ text "" ]
