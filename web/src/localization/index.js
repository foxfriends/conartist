/* @flow */
import * as React from 'react'
import { model } from '../model'
import DefaultMap from '../util/default-map'
import en from './lang/en'
import zh from './lang/zh'

const { Fragment } = React

const languages = new DefaultMap([['en', en], ['zh', zh]], {})

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

function newlinesToReact(text: string): React.Node {
  function insert<T>(item: React.Node, [...array]: React.Node[]): React.Node[] {
    let position = array.length
    while (position --> 1) {
      array.splice(position, 0, <Fragment key={`newline_${position}`}>{ item }</Fragment>)
    }
    return array
  }
  return insert(
    <br />,
    text
      .split('\n')
      .map((part, i) => <Fragment key={`text_${i}`}>{ part }</Fragment>)
  )
}

const SUBSECTION_PATTERN = /\{([^{}]+)\}/g
/// Template tag that produces a function that allows the localized string to be stylized
export function lx(strings: string[], ...args: string[]): ((string, number) => React.Node) => React.Node {
  const localized = l(strings, ...args)
  return formatter => localized.split(SUBSECTION_PATTERN).map((text, i) =>
    <Fragment key={`localized_${localized}_${i}`}>
      { i % 2 ? formatter(text, (i - 1) / 2) : newlinesToReact(text) }
    </Fragment>
  )
}
