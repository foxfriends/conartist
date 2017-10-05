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
import List_

view : Model -> PricingPageState -> Html Msg
view model page =
  div [ class "pricing" ]
    [ div [ class "pricing__table" ]
      [ table []
        [ "Type", "Product", "Quantity", "Price", "Remove" ]
        (priceRow model)
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

priceRow : Model -> PriceWithTypeAndProduct -> List (Html Msg)
priceRow model { index, product_type, quantity, price, product } =
  let types = List.map ProductType.normalize model.user.productTypes in
  [ Fancy.select
      (PricingProductType index)
      (\x -> types
        |> List_.find (\y -> y.id == x)
        |> Maybe.map (\x -> x.name)
        |> Maybe.withDefault "Unknown type")
      (List.map (\t -> t.id) types)
      product_type.id
  , text (product |> Maybe.map (\p -> p.name) |> Maybe.withDefault "")
  , text (toString quantity)
  , text ("$" ++ toString price)
  , Fancy.button Icon "remove_circle_outline" [] ]
