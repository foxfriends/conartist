/* @flow */
import type { ConventionImageFragment } from '../api/schema'

export type ConventionImage = {|
  id: string,
|}

export function parse({ id }: ConventionImageFragment): ConventionImage {
  return { id }
}
