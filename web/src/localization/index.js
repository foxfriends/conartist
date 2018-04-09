/* @flow */
import * as React from 'react'
import { model } from '../model'
import Map from '../util/default-map'
const en = require('./lang/en')
const zh =require('./lang/zh')

const { Fragment } = React

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

const PLACEHOLDER_PATTERN = "{}"
/// Template tag that localizes the given string, with placeholders filled in
export function l(strings: string[], ...args: string[]): string {
  const key = strings.join('{}')
  const lang = model.getValue().settings.language
  let localized = localize(key, lang.split('-', 1))
  for(const arg of args) {
    localized = localized.replace(PLACEHOLDER_PATTERN, arg)
  }
  return localized
}

const SUBSECTION_PATTERN = /\{([^{}]+)\}/g
/// Template tag that produces a function that allows the localized string to be stylized
export function lx(strings: string[], ...args: string[]): ((string, number) => React.Node) => React.Node {
  const localized = l(strings, ...args)
  return formatter => localized.split(SUBSECTION_PATTERN).map((text, i) =>
    <Fragment key={`localized_${localized}_${i}`}>
      { i % 2 ? formatter(text, (i - 1) / 2) : text }
    </Fragment>
  )
}
