module VPricing exposing (view)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, type_, disabled)
import Html.Events exposing (onClick, onInput)

import Model exposing (Model)
import Page exposing (PricingPageState, Selector(..))
import Msg exposing (Msg(..))
import Table exposing (tableWithSpacing, TableHeader(..))
import ProductType
import Product
import Price
import Join exposing (PriceWithTypeAndProduct)
import Fancy exposing (ButtonStyle(..))
import Align exposing (centered)
import List_

view : Model -> PricingPageState -> Html Msg
view model page =
  div [ class "pricing" ]
    [ div [ class "pricing__table" ]
      [ tableWithSpacing "1fr 1fr 1fr 1fr 100px" [] []
        [ Standard "Type", Standard "Product", Standard "Quantity", Standard "Price", (Html << centered << text) "Remove" ]
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
    , div [ class "pricing__footer" ] (footer model) ]

priceRow : Model -> PricingPageState -> PriceWithTypeAndProduct -> List (Html Msg)
priceRow model page { index, product_type, quantity, price, product } =
  let types = List.map ProductType.normalize model.user.productTypes in
  let products = model.user.products
    |> List.map Product.normalize
    |> List.filter (\p -> Just p.type_id == Maybe.map (\t -> t.id) product_type) in
  [ Fancy.select
      (SelectProductType index)
      (PricingProductType index)
      (\x -> case x of
        Just x ->
          types
            |> List_.find (\y -> y.id == x)
            |> Maybe.map (\x -> x.name)
            |> Maybe.withDefault "Unknown type"
        Nothing -> "Choose a type")
      ( types
        |> (if model.show_discontinued then identity else List.filter (\t -> not t.discontinued))
        |> List.map (\t -> t.id) )
      (product_type |> Maybe.map (\t -> t.id))
      ( case page.open_selector of
          TypeSelector i -> i == index
          _ -> False )
  , Fancy.optionalSelect
      (SelectProduct index)
      (PricingProduct index)
      (\x -> case x of
        Just x ->
          products
            |> List_.find (\y -> y.id == x)
            |> Maybe.map (\x -> x.name)
            |> Maybe.withDefault "Unknown product"
        Nothing -> "All")
      ( Nothing ::
        ( products
          |> (if model.show_discontinued then identity else List.filter (\t -> not t.discontinued))
          |> List.map (\t -> t.id)
          |> List.map Just ) )
      ( product |> Maybe.map (\t -> t.id))
      ( case page.open_selector of
          ProductSelector i -> i == index
          _ -> False )
  , Fancy.input "" (toString quantity) [ Fancy.flush ] [ type_ "text", onInput (PricingQuantity index) ]
  , Fancy.input "" (Price.priceStr price) [ Fancy.flush ] [ type_ "text", onInput (PricingPrice index) ] -- TODO: formatted/validated input fields
  , centered <| Fancy.button Icon "remove_circle_outline" [ onClick (PricingRemove index) ] ]

footer : Model -> List (Html Msg)
footer model =
  [ Fancy.tooltip "Add row" <| Fancy.button Icon "add" [ onClick PricingAdd ]
  , Fancy.button Icon "save" [ onClick Save, (disabled << not << Model.isDirty) model ] ]
