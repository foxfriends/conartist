/* @flow */
import type { UserInfoFragmentFragment } from '../api/schema'

export type ConventionUserInfo = {|
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
|}

export function parse({ id, info, vote, upvotes, downvotes }: UserInfoFragmentFragment): ConventionUserInfo {
  return {
    id,
    info,
    vote,
    upvotes,
    downvotes,
  }
}
