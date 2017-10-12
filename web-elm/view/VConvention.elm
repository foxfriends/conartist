module VConvention exposing (view, dateRange)
import Html exposing (Html, div, text, span)
import Html.Attributes exposing (class, style)
import Date exposing (Date)
import Date.Extra as Date
import Hex

import Model exposing (Model)
import Msg exposing (Msg(..))
import Page exposing (ConventionPageState)
import Fancy
import Convention exposing (Convention, MetaConvention, asMeta, asFull)
import Tabs exposing (tabs, TabItem(Tab))
import Table exposing (table)
import Card exposing (card)
import Lists exposing (defList)
import List_
import ProductType exposing (FullType)
import Product
import Price
import Join exposing (ProductWithType)

view : Model -> ConventionPageState -> Html Msg
view model page =
  case List_.find (\c -> (asMeta c).code == page.convention) model.user.conventions of
      Just con ->
        tabs ChangeConventionTab []
          [ Tab "Summary" <| summary model con
          , Tab "Products" <| products model con
          , Tab "Prices" <| prices model con
          , Tab "Sales" <| sales model con
          , Tab "Stats" <| stats model con ]
        page.current_tab
      Nothing ->
        -- TODO: make this not bad
        div [] [ text "Loading" ]

summary : Model -> Convention -> Html msg
summary _ convention =
  div [ class "convention__summary" ]
    [ conInfo (asMeta convention) ]
    -- TODO: best sellers
    -- TODO: revenue summary

conInfo : MetaConvention -> Html msg
conInfo { name, code, start, end } =
  let dayCount = 1 + Date.diff Date.Day start end in
  let plural = dayCount > 1 in
    card name
      [ class "convention__card" ]
      [ defList text
        [ ( "Code", code )
        , ( "Date", dateRange start end ++ " (" ++ toString dayCount ++ " day" ++ (if plural then "s" else "") ++ ")" )
        -- TODO: conventions could have more data associated with them...
        --       maybe there's some API out there somewhere...
        --       maybe I invent such an API...
        -- , ( "Location", "Unknown" )
        -- , ( "Hours", "Unknown" )
        -- , ( "Setup Time", "Unknown" )
        ]
      ]
      []

products : Model -> Convention -> Html msg
products model con =
  case asFull con of
    Nothing -> div [] []
    Just fc ->
      table [] [ "Type", "Name", "Quantity" ]
        productRow
        <| Join.productsWithTypes
            (List.map ProductType.normalize (model.user.productTypes))
            (List.map Product.normalize (if List.isEmpty fc.products then model.user.products else fc.products))


productRow : ProductWithType -> List (Html msg)
productRow product =
  [ productTypeLabel product.product_type
  , text product.name
  , text (toString product.quantity) ]

productTypeLabel : FullType -> Html msg
productTypeLabel { color, name } =
  div [ class "convention__product-type"]
    [ Fancy.letterCircle (String.cons '#' <| String.padLeft 6 '0' <| Hex.toString color) (String.left 1 name)
    , text name ]

prices : Model -> Convention -> Html msg
prices _ _ = div [] []

sales : Model -> Convention -> Html msg
sales _ _ = div [] []

stats : Model -> Convention -> Html msg
stats _ _ = div [] []

dateRange : Date -> Date -> String
dateRange start end = (Convention.formatDate start) ++ "–" ++ (Convention.formatDate end)
