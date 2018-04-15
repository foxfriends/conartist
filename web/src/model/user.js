/* @flow */
import type { Settings } from './settings'
import type { MetaConvention } from './convention'
import type { ProductType } from './product-type'
import type { Product } from './product'
import type { Price } from './price'

export type User = {
  name: string,
  email: string,
  settings: Settings,
  productTypes: ProductType[],
  products: Product[],
  prices: Price[],
  conventions: MetaConvention[],
}
