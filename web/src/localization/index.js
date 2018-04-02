/* @flow */
import { model } from '../model'
import Map from '../util/default-map'
const en = require('./lang/en')
const zh =require('./lang/zh')

const languages = new Map([['en', en], ['zh', zh]], {})

function localize(locale: string | string[], key: string): ?string {
  return locale instanceof Array
    ? localize(locale.join('-'), key) || localize(locale[0], key)
    : languages.get(locale)[key]
}

export default function l(strings: string[], ...args: String[]): string {
  const key = strings.join('{}')
  const lang = model.getValue().settings.language
  return localize(lang.split('-', 1), key) || key
}
