/* @flow */
import type { ProductTypeFragment } from '../api/schema'

export type ProductType = {|
  id: number,
  name: string,
  color: ?number,
  sort: number,
  discontinued: boolean,
|}

export function parse({ id, name, color, sort, discontinued }: ProductTypeFragment): ProductType {
  return {
    id,
    name,
    color,
    sort,
    discontinued,
  }
}
