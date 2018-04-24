/* @flow */
import type { ProductFragmentFragment } from '../api/schema'

export type Product = {|
  id: number,
  typeId: number,
  name: string,
  quantity: number,
  discontinued: boolean,
|}

export function parse({ id, typeId, name, quantity, discontinued }: ProductFragmentFragment): Product {
  return {
    id,
    typeId,
    name,
    quantity,
    discontinued,
  }
}
