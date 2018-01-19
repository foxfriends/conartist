module View.Convention.Sort exposing (..)
import Date.Extra as Date

import Model.Join as Join exposing (ProductWithType, PriceWithTypeAndProduct, RecordWithTypedProduct)
import Model.Product as Product
import Model.ProductType as ProductType
import Model.Price as Price
import Model.Money as Money

typesort : ProductWithType -> ProductWithType -> Order
typesort a b = compare (ProductType.normalize a.productType).name (ProductType.normalize b.productType).name

namesort : ProductWithType -> ProductWithType -> Order
namesort a b = compare (Product.normalize a.product).name (Product.normalize a.product).name

maybetypesort : PriceWithTypeAndProduct -> PriceWithTypeAndProduct -> Order
maybetypesort a b =
  let extract = Maybe.map (ProductType.normalize >> .name) >> Maybe.withDefault "" in
    compare
      (extract a.productType)
      (extract b.productType)

maybeproductsort : PriceWithTypeAndProduct -> PriceWithTypeAndProduct -> Order
maybeproductsort a b =
  let extract = Maybe.map (Product.normalize >> .name) >> Maybe.withDefault "" in
    compare
      (extract a.product)
      (extract b.product)

quantitysort : ProductWithType -> ProductWithType -> Order
quantitysort a b = compare (Product.normalize a.product).quantity (Product.normalize a.product).quantity

pquantitysort : PriceWithTypeAndProduct -> PriceWithTypeAndProduct -> Order
pquantitysort a b =
  let extract = Price.normalize >> Maybe.map .quantity >> Maybe.withDefault 0 in
    compare (extract a.price) (extract b.price)

rquantitysort : RecordWithTypedProduct -> RecordWithTypedProduct -> Order
rquantitysort a b = compare (List.length a.products) (List.length b.products)

pricesort : PriceWithTypeAndProduct -> PriceWithTypeAndProduct -> Order
pricesort a b =
  let extract = Price.normalize >> Maybe.map .price >> Maybe.map Money.numeric >> Maybe.withDefault 0 in
    compare (extract a.price) (extract b.price)

rpricesort : RecordWithTypedProduct -> RecordWithTypedProduct -> Order
rpricesort a b = compare (Money.numeric a.price) (Money.numeric b.price)

timesort : RecordWithTypedProduct -> RecordWithTypedProduct -> Order
timesort a b = Date.compare a.time b.time
