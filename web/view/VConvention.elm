module VConvention exposing (view, dateRange)
import Html exposing (Html, div, text, span)
import Html.Attributes exposing (class, style)
import Date exposing (Date)
import Date.Extra as Date
import Hex
import Either exposing (Either(Right))
import Dict
import Set

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
import Join exposing (ProductWithType, PriceWithTypeAndProduct, RecordWithTypedProduct)

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
        placeholder "Convention loading..."

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
    Nothing -> errorPage
    Just fc ->
      table [] [ "Type", "Name", "Quantity" ]
        productRow <|
        Join.productsWithTypes
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
    [ productCircle color name
    , text name ]

productCircle : Int -> String -> Html msg
productCircle color name = Fancy.letterCircle (String.cons '#' <| String.padLeft 6 '0' <| Hex.toString color) (String.left 1 name)

prices : Model -> Convention -> Html msg
prices model con =
  case asFull con of
    Nothing -> errorPage
    Just fc ->
      table [] [ "Type", "Product", "Quantity", "Price" ]
        priceRow <|
          List.filterMap (\p -> Maybe.map (always p) p.product_type) <|
            Join.pricesWithProductsAndTypes
              (List.map ProductType.normalize (model.user.productTypes))
              (List.map Product.normalize (if List.isEmpty fc.products then model.user.products else fc.products))
              (List.filterMap Price.normalize (if List.isEmpty fc.prices then model.user.prices else fc.prices))

priceRow : PriceWithTypeAndProduct -> List (Html msg)
priceRow { product, product_type, quantity, price } =
  [ product_type |> Maybe.map productTypeLabel |> Maybe.withDefault (text "")
  , text <| (product |> Maybe.map (\p -> p.name) |> Maybe.withDefault "")
  , text (toString quantity)
  , text (Price.priceStr price) ]

sales : Model -> Convention -> Html msg
sales model con =
  case asFull con of
    Nothing -> errorPage
    Just fc ->
      case fc.records of
        [] -> placeholder "You haven't sold anything yet!"
        _  ->
          table [] [ "Type", "Products", "Quantity", "Price", "Time" ]
            recordRow <|
            Join.recordsWithTypedProducts
              (List.map ProductType.normalize (model.user.productTypes))
              (List.map Product.normalize (if List.isEmpty fc.products then model.user.products else fc.products))
              fc.records

recordRow : RecordWithTypedProduct -> List (Html msg)
recordRow record =
  [ div [ class "convention__product-type" ] <| typeSet record.products
  , text <| productString record.products
  , text <| toString <| List.length record.products
  , text <| Price.priceStr <| Right record.price
  , text <| Date.toFormattedString "EEE, h:mm a" record.time ]

typeSet : List ProductWithType -> List (Html msg)
typeSet =
  List.map (\p -> (p.product_type.color, p.product_type.name))
    >> Set.fromList
    >> Set.foldl (\c -> \p -> (uncurry productCircle) c :: p) []

productString : List ProductWithType -> String
productString products =
  let reducer c p =
    Dict.update c.name (\v -> case v of
        Nothing -> Just 1
        Just o -> Just (o + 1)) p in
  let expander k v p =
    p ++ case v of
      1 -> k ++ ", "
      _ -> k ++ " (" ++ toString v ++ "), "
    in
  products
    |> List.foldl reducer Dict.empty
    |> Dict.foldl expander ""
    |> String.dropRight 2

stats : Model -> Convention -> Html msg
stats _ _ = placeholder "This page has not yet been created!"

dateRange : Date -> Date -> String
dateRange start end = (Convention.formatDate start) ++ "–" ++ (Convention.formatDate end)

errorPage : Html msg
errorPage = placeholder "It seems something has gone wrong. Maybe you should reload."

placeholder : String -> Html msg
placeholder str = div [ class "convention__placeholder" ] [ text str ]
