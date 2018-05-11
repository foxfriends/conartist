/* @flow */
import type { ProductTypeFragmentFragment } from '../api/schema'

export type ProductType = {|
  id: number,
  name: string,
  color: ?number,
  sort: number,
  discontinued: boolean,
|}

export function parse({ id, name, color, sort, discontinued }: ProductTypeFragmentFragment): ProductType {
  return {
    id,
    name,
    color,
    sort,
    discontinued,
  }
}
