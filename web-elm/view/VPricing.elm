module VPricing exposing (view)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)

import Model exposing (Model)
import Page exposing (PricingPageState, Selector(..))
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
        (priceRow model page)
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

priceRow : Model -> PricingPageState -> PriceWithTypeAndProduct -> List (Html Msg)
priceRow model page { index, product_type, quantity, price, product } =
  let types = List.map ProductType.normalize model.user.productTypes in
  [ Fancy.select
      (SelectProductType index)
      (PricingProductType index)
      (\x -> types
        |> List_.find (\y -> y.id == x)
        |> Maybe.map (\x -> x.name)
        |> Maybe.withDefault "Unknown type")
      (types
        |> (if model.show_discontinued then identity else List.filter (\t -> not t.discontinued))
        |> List.map (\t -> t.id) )
      product_type.id
      ( case page.open_selector of
          TypeSelector i -> i == index
          _ -> False )
  , text (product |> Maybe.map (\p -> p.name) |> Maybe.withDefault "")
  , text (toString quantity)
  , text ("$" ++ toString price)
  , Fancy.button Icon "remove_circle_outline" [] ]
