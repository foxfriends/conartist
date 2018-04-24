/* @flow */
import type { ConventionImageFragmentFragment } from '../api/schema'

export type ConventionImage = {|
  id: string,
|}

export function parse({ id }: ConventionImageFragmentFragment): ConventionImage {
  return { id }
}
