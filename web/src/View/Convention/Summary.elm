module View.Convention.Summary exposing (view)
import Html exposing (Html, div, text, span)
import Html.Attributes exposing (class)
import Date.Extra as Date
import Dict exposing (Dict)

import Model.Model exposing (Model)
import Model.Convention as Convention exposing (Convention, MetaConvention, asMeta)
import Model.ProductType as ProductType
import Model.Product as Product
import Model.Money as Money
import View.Card exposing (card)
import View.List exposing (defList)
import View.Convention.Util exposing (dateRange, frequency)
import View.Attributes exposing (tabularFigures)
import Util.List as List

view : Model -> Convention -> Html msg
view model convention =
  div [ class "convention__summary" ]
    (conInfo (asMeta convention) ::
      (if Date.compare (Convention.asMeta convention).start model.now == GT then
        [ disclaimer ]
      else
        [ bestSellers convention
        , revenue model convention ]))

conInfo : MetaConvention -> Html msg
conInfo { name, start, end, extraInfo } =
  let dayCount = 1 + Date.diff Date.Day start end
      plural = dayCount > 1
  in
    card name
      [ class "convention__card" ]
      [ defList text
        [ ( "Date", dateRange start end ++ " (" ++ toString dayCount ++ " day" ++ (if plural then "s" else "") ++ ")" )
        -- TODO: parse the extraInfo and fill this in accordingly
        -- , ( "Location", "Unknown" )
        -- , ( "Hours", "Unknown" )
        -- , ( "Setup Time", "Unknown" )
        ]
      ]
      []

bestSellers : Convention -> Html msg
bestSellers con =
  case Convention.asFull con of
    Just con ->
      let
        allRecordProducts = List.concatMap .products con.records
        normalProducts = List.map Product.normalize con.products
        maxBy fn a b = if fn a > fn b then a else b
        mostFrequent list =
          List.foldl frequency Dict.empty list
            |> Dict.toList
            |> List.foldl (maxBy Tuple.second) (0, 0)
            |> Tuple.first
        product =
          allRecordProducts
            |> mostFrequent
            |> \p -> List.find (.id >> (==) p) normalProducts
            |> Maybe.map .name
            |> Maybe.withDefault "Unknown"
        productType =
          allRecordProducts
            |> List.filterMap (\p -> (List.find (.id >> (==) p) normalProducts))
            |> List.map .type_id
            |> mostFrequent
            |> \t -> List.find (ProductType.normalize >> .id >> (==) t) con.productTypes
            |> Maybe.map (ProductType.normalize >> .name)
            |> Maybe.withDefault "Unknown"
      in
      card "Best Sellers"
        [ class "convention__card" ]
        [ defList text
          [ ("Best product", product)
          , ("Best type of product", productType)
          ]
        ]
        []
    Nothing -> text ""

revenue : Model -> Convention -> Html msg
revenue model con =
  case Convention.asFull con of
    Just con ->
      let
        (quantity, gross) =
          con.records
            |> List.foldl (\r -> \(q, p) -> (q + List.length r.products, Maybe.withDefault r.price <| Money.add p r.price)) (0, Money.money 0)
        expense = Money.money 0
        net = Maybe.withDefault gross <| Money.add gross expense -- TODO: subtract?
      in
      card "Sales summary"
        [ class "convention__card" ]
        [ defList (span [ tabularFigures ] << List.singleton << text)
          [ ("Gross profit", Money.prettyprint <| Money.resolveAuto model.user.settings.currency gross)
          , ("Total expense", Money.prettyprint <| Money.resolveAuto model.user.settings.currency expense)
          , ("Net profit", Money.prettyprint <| Money.resolveAuto model.user.settings.currency net)
          , ("Items sold", toString quantity)
          ]
        ]
        []
    Nothing -> text ""

disclaimer : Html msg
disclaimer =
  card "Note"
    [ class "convention__card" ]
    [ text  """
            This convention has not yet started! Products and prices you see here
            show what will you plan to be selling. Make sure everything looks
            right before the day comes!
            """ ]
    []
