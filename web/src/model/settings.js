/* @flow */
import type { SettingsFragment } from '../api/schema'
import type { Currency } from './money'

export type Settings = {|
  currency: Currency,
  language: string,
|}

export function parse({ currency, language }: SettingsFragment): Settings {
  return {
    currency,
    language,
  }
}
