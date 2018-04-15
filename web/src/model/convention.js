/* @flow */
import type { Money } from './money'
import type { ProductType } from './product-type'
import type { Product } from './product'
import type { Price } from './price'
import type { Record } from './record'
import type { Expense } from './expense'

export type Convention = MetaConvention | FullConvention

export type MetaConvention = {
  id: number,
  name: string,
  images: Image[],
  start: Date,
  end: Date,
  extraInfo: ExtraInfo,
  userInfo: UserInfo,
  recordTotal: Money,
  expenseTotal: Money,
}

export type FullConvention = MetaConvention & {
  products: Product[],
  productTypes: ProductType[],
  prices: Price[],
  records: Record[],
  expenses: Expense[],
}

export type Image = {
  id: string,
}

export type ExtraInfo = {
  title: string,
  info: string,
  action: string,
  actionText: string,
}

export type UserInfo = {
  id: number,
  info: string,
  vote: boolean,
  upvotes: number,
  downvotes: number,
}

