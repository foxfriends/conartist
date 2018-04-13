/* @flow */
import type { Settings } from './settings'
import type { MetaConvention } from './convention'

export type User = {|
  name: string,
  email: string,
  settings: Settings,
  conventions: MetaConvention[],
|}
