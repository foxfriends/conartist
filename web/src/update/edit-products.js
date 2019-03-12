/* @flow */
import { model } from '../model'
import type { ProductType } from '../model/product-type'
import type { Product } from '../model/product'

export function setProducts(products: Product[]) {
  model.next({
    ...model.getValue(),
    products,
    prices: model.getValue()
      .prices
      .filter(({ productId }) => productId === null || !!products.find(product => product.id == productId))
  })
}

export function setProductTypes(productTypes: ProductType[]) {
  model.next({
    ...model.getValue(),
    productTypes,
    prices: model.getValue()
      .prices
      .filter(({ typeId }) => !!productTypes.find(type => type.id === typeId))
  })
}
