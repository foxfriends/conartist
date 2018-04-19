/* @flow */
import type { Price } from '../../model/price'
import type { Product } from '../../model/product'
import type { ProductType } from '../../model/product-type'

export type Props = {
  name: 'edit-prices',
  prices: Price[],
  products: Product[],
  productTypes: ProductType[],
}
