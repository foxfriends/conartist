/* @flow */
import type { UserInfoFragment } from '../api/schema'

export type ConventionUserInfo = {|
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
|}

export function parse({ id, info, vote, upvotes, downvotes }: UserInfoFragment): ConventionUserInfo {
  return {
    id,
    info,
    vote,
    upvotes,
    downvotes,
  }
}
