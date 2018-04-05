/* @flow */
import { model } from '../model'
import Map from '../util/default-map'
const en = require('./lang/en')
const zh =require('./lang/zh')

const languages = new Map([['en', en], ['zh', zh]], {})

function doLocalize(key: string, locale: string | string[]): ?string {
  return locale instanceof Array
    ? doLocalize(key, locale.join('-')) || doLocalize(key, locale[0])
    : languages.get(locale)[key]
}

export function localize(key: string, locale: ?(string | string[])): string {
  locale = locale || model.getValue().settings.language.split('-', 1)
  return doLocalize(key, locale) || key
}

/// Template tag that loocalizes the given string, with placeholders filled in
export function l(strings: string[], ...args: string[]): string {
  const key = strings.join('{}')
  const lang = model.getValue().settings.language
  let localized = localize(key, lang.split('-', 1))
  for(const arg of args) {
    localized = localized.replace("{}", arg)
  }
  return localized
}
