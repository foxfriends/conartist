/* @flow */
import type { ProductTypeFragmentFragment } from '../api/schema'

export type ProductType = {|
  id: number,
  name: string,
  color: ?number,
  discontinued: boolean,
|}

export function parse({ id, name, color, discontinued }: ProductTypeFragmentFragment): ProductType {
  return {
    id,
    name,
    color,
    discontinued,
  }
}
