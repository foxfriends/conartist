/* @flow */
import type { ProductType } from '../../model/product-type'
import type { Product } from '../../model/product'

export type EditableProductType = {
  productType: ?ProductType,
  id: Id,
  name: string,
  color: ?number,
  discontinued: boolean,
}

export type EditableProduct = {
  product: ?Product,
  id: Id,
  typeId: Id,
  name: string,
  quantity: number,
  discontinued: boolean,
}

export type Id = number | string

let idCounter = 0
export function uniqueId(): Id {
  return `id_${idCounter++}`
}
export function peekId(): Id {
  return `id_${idCounter}`
}
