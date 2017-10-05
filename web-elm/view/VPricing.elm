module VPricing exposing (view)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)

import Model exposing (Model)
import Page exposing (PricingPageState)
import Msg exposing (Msg(..))
import Table exposing (table)
import ProductType
import Product
import Price
import Join exposing (PriceWithTypeAndProduct)
import Fancy exposing (ButtonStyle(..))

view : Model -> PricingPageState -> Html Msg
view model page =
  div [ class "pricing" ]
    [ div [ class "pricing__table" ]
      [ table []
        [ "Type", "Product", "Quantity", "Price", "Remove" ]
        priceRow
        ( Join.pricesWithProductsAndTypes
          ( model.user.productTypes
            |> List.map ProductType.normalize
            |> List.filter (\p -> not p.discontinued) )
          ( model.user.products
            |> List.map Product.normalize
            |> List.filter (\p -> not p.discontinued) )
          ( model.user.prices
            |> List.filterMap Price.normalize) ) ]
    , div [ class "pricing__footer" ] [] ]

priceRow : PriceWithTypeAndProduct -> List (Html Msg)
priceRow price =
  [ text price.product_type.name
  , text (price.product |> Maybe.map (\p -> p.name) |> Maybe.withDefault "")
  , text (toString price.quantity)
  , text ("$" ++ toString price.price)
  , Fancy.button Icon "remove_circle_outline" [] ]
