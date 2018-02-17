module View.Convention.Prices exposing (view)
import Html exposing (Html, div, text, span)

import Msg exposing (Msg(..))
import Model.Join as Join exposing (PriceWithTypeAndProduct)
import Model.Model exposing (Model)
import Model.Page exposing (ConventionPageState)
import Model.Convention as Convention exposing (Convention, asFull)
import Model.ProductType as ProductType
import Model.Product as Product
import Model.Price as Price
import Model.Money as Money
import View.Attributes exposing (tabularFigures)
import View.Table as Table exposing (basicSortableTable, TableHeader(..))
import View.Convention.Util exposing (errorPage, productTypeLabel)
import View.Convention.Sort exposing (..)

view : Model -> ConventionPageState -> Convention -> Html Msg
view model page con =
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
  , div [ Table.cellLiner, tabularFigures ] [text (Price.normalize price |> Maybe.map .price |> Maybe.withDefault (Money.money 0) |> Money.prettyprint)] ]
