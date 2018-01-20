module View.Convention.Sales exposing (view)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, style)
import Date.Extra as Date
import Dict exposing (Dict)
import Set

import Msg exposing (Msg(..))
import Model.Join as Join exposing (ProductWithType, RecordWithTypedProduct)
import Model.Model exposing (Model)
import Model.Page exposing (ConventionPageState)
import Model.Convention as Convention exposing (Convention, asFull)
import Model.ProductType as ProductType
import Model.Product as Product
import Model.Money as Money
import View.Table as Table exposing (summarizedTable, TableHeader(..))
import Util.Date as Date
import View.Convention.Util exposing (errorPage, placeholder, productCircle)
import View.Convention.Sort exposing (..)
import View.Attributes exposing (currencyText)

view : Model -> ConventionPageState -> Convention -> Html Msg
view model page con =
  case asFull con of
    Nothing -> errorPage
    Just fc ->
      case fc.records of
        [] -> placeholder "You haven't sold anything yet!"
        _  ->
          summarizedTable
            (case page.record_sort of
              [EQ, EQ, EQ, EQ, _] -> (Just (Money.money 0, 0, (Convention.asMeta con).start))
              _ -> Nothing)
            (\m -> \rec -> case m of
              Nothing -> (Nothing, [])
              Just (p, q, d) ->
                case rec of
                  Just rec ->
                    if Date.utcWeekdayNumber d == Date.utcWeekdayNumber rec.time then
                      (Just (Maybe.withDefault p (Money.add p rec.price), q + List.length rec.products, rec.time), [])
                    else
                      ( Just (rec.price, List.length rec.products, rec.time)
                      , [ text "Total"
                        , text ""
                        , text (toString q)
                        , div [Table.cellLiner, currencyText] [text (Money.prettyprint p)]
                        , text "" ])
                  Nothing ->
                    ( Nothing
                    , [ text "Total"
                      , text ""
                      , text (toString q)
                      , div [Table.cellLiner, currencyText] [text (Money.prettyprint p)]
                      , text "" ]))
            page.record_sort
            "1fr 1fr 1fr 1fr 1fr" [] []
            [ Standard "Type"
            , Standard "Products"
            , Sortable "Quantity" rquantitysort SortConRecordsTable
            , Sortable "Price" rpricesort SortConRecordsTable
            , Sortable "Time" timesort SortConRecordsTable ]
            recordRow
            ( fc.records
                |> List.sortWith (\a -> \b -> Date.compare a.time b.time)
                |> Join.recordsWithTypedProducts
                  model.user.productTypes
                  (if List.isEmpty fc.products then model.user.products else fc.products) )

recordRow : RecordWithTypedProduct -> List (Html msg)
recordRow record =
  [ div [ class "convention__product-type" ] <| typeSet record.products
  , text <| productString record.products
  , text <| toString (List.length record.products)
  , div [ Table.cellLiner, currencyText ] [ text <| Money.prettyprint record.price ]
  , text <| Date.toFormattedString "EEE, h:mm a" record.time ]

typeSet : List ProductWithType -> List (Html msg)
typeSet =
  List.map (.productType >> ProductType.normalize >> (\p -> (p.color, p.name)))
    >> Set.fromList
    >> Set.foldl (uncurry productCircle >> (::)) []

productString : List ProductWithType -> String
productString products =
  let
    reducer c p =
      Dict.update c.name (\v -> case v of
        Nothing -> Just 1
        Just o -> Just (o + 1)) p
    expander k v p =
      p ++ case v of
        1 -> k ++ ", "
        _ -> k ++ " (" ++ toString v ++ "), "
  in products
    |> List.map (.product >> Product.normalize)
    |> List.foldl reducer Dict.empty
    |> Dict.foldl expander ""
    |> String.dropRight 2
