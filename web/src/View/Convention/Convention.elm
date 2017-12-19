module View.Convention.Convention exposing (view)
import Html exposing (Html, div, text, span)
import Html.Attributes exposing (class, style)
import Date.Extra as Date
import Either exposing (Either(..))
import Dict exposing (Dict)
import Hex
import Set
import Mouse

import Msg exposing (Msg(..))
import Model.Join as Join exposing (ProductWithType, PriceWithTypeAndProduct, RecordWithTypedProduct)
import Model.Model exposing (Model)
import Model.Page exposing (ConventionPageState)
import Model.Convention as Convention exposing (Convention, MetaConvention, asMeta, asFull)
import Model.ProductType as ProductType exposing (ProductType, FullType)
import Model.Product as Product
import Model.Price as Price
import Model.ChartSettings as ChartSettings
import View.Tabs exposing (tabs, TabItem(Tab))
import View.Table exposing (summarizedTable, basicSortableTable, TableHeader(..))
import View.Fancy as Fancy
import View.Chart.Inventory
import View.Chart.Settings as Settings
import Util.List as List
import View.Drawer as Drawer
import Util.Maybe as Maybe
import Util.Date as Date
import View.Convention.Summary as Summary
import View.Convention.Products as Products
import View.Convention.Util exposing (dateRange, frequency, errorPage, placeholder, productTypeLabel, productCircle)
import View.Convention.Sort exposing (..)

view : Model -> ConventionPageState -> Html Msg
view model page =
  case List.find (asMeta >> .code >> (==) page.convention) model.user.conventions of
      Just con ->
        (tabs
          ChangeConventionTab
          []
            [ Tab "Summary" <| Summary.view model con
            , Tab "Products" <| Products.view model page con
            , Tab "Prices" <| prices model page con
            , Tab "Sales" <| sales model page con
            , Tab "Stats" <| stats model page con ]
          page.current_tab)
      Nothing ->
        placeholder "Convention loading..."

prices : Model -> ConventionPageState -> Convention -> Html Msg
prices model page con =
  case asFull con of
    Nothing -> errorPage
    Just fc ->
      basicSortableTable page.price_sort []
        [ Sortable "Type" maybetypesort SortConPricesTable
        , Sortable "Product" maybeproductsort SortConPricesTable
        , Sortable "Quantity" pquantitysort SortConPricesTable
        , Sortable "Price" pricesort SortConPricesTable ]
        priceRow <|
          List.filterMap (\p -> Maybe.map (always p) p.productType) <|
            Join.pricesWithProductsAndTypes
              model.user.productTypes
              (if List.isEmpty fc.products then model.user.products else fc.products)
              (if List.isEmpty fc.prices then model.user.prices else fc.prices)

priceRow : PriceWithTypeAndProduct -> List (Html msg)
priceRow { product, productType, price } =
  [ productType |> Maybe.map (ProductType.normalize >> productTypeLabel) |> Maybe.withDefault (text "")
  , text <| (product |> Maybe.map (Product.normalize >> .name) |> Maybe.withDefault "")
  , text (price |> Price.normalize >> Maybe.map .quantity |> Maybe.withDefault 0 >> toString)
  , text (Price.priceStr (Left (Maybe.map .price (Price.normalize price) |> Maybe.withDefault 0))) ]

sales : Model -> ConventionPageState -> Convention -> Html Msg
sales model page con =
  case asFull con of
    Nothing -> errorPage
    Just fc ->
      case fc.records of
        [] -> placeholder "You haven't sold anything yet!"
        _  ->
          let _ = Debug.log "date" <| Date.utcWeekdayNumber (Convention.asMeta con).start in
          summarizedTable
            (case page.record_sort of
              [EQ, EQ, EQ, EQ, _] -> (Just (0, 0, (Convention.asMeta con).start))
              _ -> Nothing)
            (\m -> \rec -> case m of
              Nothing -> (Nothing, [])
              Just (p, q, d) ->
                case rec of
                  Just rec ->
                    if Date.utcWeekdayNumber d == Date.utcWeekdayNumber rec.time then
                      (Just (p + rec.price, q + List.length rec.products, rec.time), [])
                    else
                      ( Just (rec.price, List.length rec.products, rec.time)
                      , [ text "Total"
                        , text ""
                        , text (toString q)
                        , text (Price.priceStr (Left p))
                        , text "" ])
                  Nothing ->
                    ( Nothing
                    , [ text "Total"
                      , text ""
                      , text (toString q)
                      , text (Price.priceStr (Left p))
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
  , text <| Price.priceStr (Left record.price)
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

stats : Model -> ConventionPageState -> Convention -> Html Msg
stats model page con =
  case asFull con of
    Nothing -> errorPage
    Just fc -> case fc.records of
      [] -> placeholder "You haven't sold anything, so there are no stats to report!"
      _ ->
        Drawer.drawerContainer [ class "convention__stats-container" ]
          (Drawer.rightDrawer (Maybe.isSomething page.open_settings) ChartHideSettings [] [ Settings.view model page ])
          ( div
              [ class "convention__stats" ]
              [ inventoryChart model.mouse page.chart_settings.inventory fc ] )

inventoryChart : Mouse.Position -> ChartSettings.Inventory -> Convention.FullConvention -> Html Msg
inventoryChart hovering settings fc =
  case settings.product_type of
    -- TODO: adjust placement of settings button to look like it's attached to the chart
    Nothing ->
      div
        [ class "convention__chart" ]
        [ placeholder "Choose a product type"
        -- TODO: put a chart placeholder background image here
        , Settings.button InventoryChartShowSettings ]
    Just type_ ->
      let
        soldQuantity = List.foldl frequency Dict.empty (List.concatMap .products fc.records)
      in View.Chart.Inventory.view
        settings.hovering
        [ class "convention__chart" ]
        [ "#81c784", "#e57373" ]
        (fc.products
          |> List.map Product.normalize
          |> List.filter (.type_id >> (==) type_)
          |> List.map (\{id, name, quantity} ->
            (name
            , [ toFloat quantity
              , toFloat (max 0 <| quantity - (Dict.get id soldQuantity |> Maybe.withDefault 0)) ])))

-- Lots of dumb sort functions
-- Many are repeated in the other view files
-- TODO: make these standardized somewhere, or improve the syntax of sort tables
