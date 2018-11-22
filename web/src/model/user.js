/* @flow */
import type { FullUserFragment } from '../api/schema'
import { parse as parseSettings } from './settings'
import { parse as parseConvention } from './meta-convention'
import { parse as parseProductType } from './product-type'
import { parse as parseProduct } from './product'
import { parse as parsePrice } from './price'
import type { Settings } from './settings'
import type { MetaConvention } from './meta-convention'
import type { ProductType } from './product-type'
import type { Product } from './product'
import type { Price } from './price'

export type User = {|
  name: string,
  email: string,
  settings: Settings,
  productTypes: ProductType[],
  products: Product[],
  prices: Price[],
  conventions: MetaConvention[],
  clearance: number,
|}

export function parse({ name, email, settings, productTypes = [], products = [], prices = [], conventions, clearance }: FullUserFragment): User {
  return {
    name,
    email,
    settings: parseSettings(settings),
    productTypes: productTypes.map(parseProductType),
    products: products.map(parseProduct),
    prices: prices.map(parsePrice),
    conventions: conventions.map(parseConvention),
    clearance,
  }
}
