module View.Convention.Products exposing (view)
import Html exposing (Html, div, text)

import Msg exposing (Msg(..))
import Model.Model exposing (Model)
import Model.Join as Join exposing (ProductWithType)
import Model.Page exposing (ConventionPageState)
import Model.Convention as Convention exposing (Convention, asFull)
import Model.ProductType as ProductType
import Model.Product as Product
import View.Table exposing (basicSortableTable, TableHeader(..))
import View.Convention.Util exposing (errorPage, productTypeLabel)
import View.Convention.Sort exposing (..)

view : Model -> ConventionPageState -> Convention -> Html Msg
view model page con =
  case asFull con of
    Nothing -> errorPage
    Just fc ->
      basicSortableTable page.product_sort []
        [ Sortable "Type" typesort SortConProductsTable
        , Sortable "Name" namesort SortConProductsTable
        , Sortable "Quantity" quantitysort SortConProductsTable ]
        productRow <|
        Join.productsWithTypes model.user.productTypes
          (if List.isEmpty fc.products then model.user.products else fc.products)

productRow : ProductWithType -> List (Html msg)
productRow p =
  let
    product = Product.normalize p.product
    productType = ProductType.normalize p.productType
  in
    [ productTypeLabel productType
    , text product.name
    , text (toString product.quantity) ]
