/* @flow */
import type { ProductFragmentFragment } from '../api/schema'

export type Product = {|
  id: number,
  typeId: number,
  name: string,
  quantity: number,
  sort: number,
  discontinued: boolean,
|}

export function parse({ id, typeId, name, quantity, sort, discontinued }: ProductFragmentFragment): Product {
  return {
    id,
    typeId,
    name,
    quantity,
    sort,
    discontinued,
  }
}
