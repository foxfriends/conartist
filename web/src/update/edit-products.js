/* @flow */
import { model } from '../model'
import type { ProductType } from '../model/product-type'
import type { Product } from '../model/product'

export function setProducts(products: Product[]) {
  model.next({
    ...model.getValue(),
    products,
  })
}

export function setProductTypes(productTypes: ProductType[]) {
  model.next({
    ...model.getValue(),
    productTypes,
  })
}
