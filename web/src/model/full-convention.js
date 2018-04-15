/* @flow */
import type { FullConventionFragmentFragment } from '../api/schema'
import { parse as parseMetaConvention } from './meta-convention'
import { parse as parseProduct } from './product'
import { parse as parseProductType } from './product-type'
import { parse as parsePrice } from './price'
import { parse as parseRecord } from './record'
import { parse as parseExpense } from './expense'
import type { MetaConvention } from './meta-convention'
import type { Product } from './product'
import type { ProductType } from './product-type'
import type { Price } from './price'
import type { Record } from './record'
import type { Expense } from './expense'

export type FullConvention = MetaConvention & {|
  products: Product[],
  productTypes: ProductType[],
  prices: Price[],
  records: Record[],
  expenses: Expense[],
|}

export function parse({ products, productTypes, prices, records, expenses, ...meta }: FullConventionFragmentFragment): FullConvention {
  // $FlowIgnore: Not good at spread with exact types
  return {
    ...parseMetaConvention(meta),
    products: products.map(parseProduct),
    productTypes: productTypes.map(parseProductType),
    prices: prices.map(parsePrice),
    records: records.map(parseRecord),
    expenses: expenses.map(parseExpense),
  }
}
