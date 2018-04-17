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

let typeIdCounter = 0
export function uniqueTypeId(): Id {
  return `id_${typeIdCounter++}`
}

let productIdCounter = 0
export function uniqueProductId(): Id {
  return `id_${productIdCounter++}`
}

export function peekTypeId(): Id {
  return `id_${typeIdCounter}`
}
