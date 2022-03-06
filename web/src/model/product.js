/* @flow */
import type { ProductFragment } from '../api/schema'

export type Product = {|
  id: number,
  typeId: number,
  name: string,
  sku: ?string,
  quantity: number,
  sort: number,
  discontinued: boolean,
|}

export function parse({ id, typeId, name, sku, quantity, sort, discontinued }: ProductFragment): Product {
  return {
    id,
    typeId,
    name,
    sku,
    quantity,
    sort,
    discontinued,
  }
}
