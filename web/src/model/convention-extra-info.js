/* @flow */
import type { ExtraInfoFragmentFragment } from '../api/schema'

export type ConventionExtraInfo = {|
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
|}

export function parse({ title, info, action, actionText }: ExtraInfoFragmentFragment): ConventionExtraInfo {
  return {
    title,
    info,
    action,
    actionText,
  }
}
