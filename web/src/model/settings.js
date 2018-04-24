/* @flow */
import type { SettingsFragmentFragment } from '../api/schema'
import type { Currency } from './money'

export type Settings = {|
  currency: Currency,
  language: string,
|}

export function parse({ currency, language }: SettingsFragmentFragment): Settings {
  return {
    currency,
    language,
  }
}
