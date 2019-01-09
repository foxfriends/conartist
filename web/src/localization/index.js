/* @flow */
import * as React from 'react'
import { model } from '../model'
import DefaultMap from '../util/default-map'
import { newlinesToReact } from '../util/newlines-to-react'
import { Storage } from '../storage'
import en from './lang/en.toml' // include this one statically since it is the most common
const zh = () => import(/* webpackChunkName: 'lang-zh' */ './lang/zh.toml')

const { Fragment } = React

const languages = new class LanguageMap {
  constructor() {
    this.languages = new DefaultMap([['en', en]], {}) //, ['zh', zh]], {})
    this.storedDefault = Storage.retrieve(Storage.Localization) || en // most likely language to be needed on page load
  }

  get(locale: string): { [string]: string | { web: string } } {
    const language = this.languages.get(locale)
    if (typeof language === 'function') {
      language()
        .then(language => {
          this.languages.set(locale, language)
          Storage.store(Storage.Localization, language)
          this.storedDefault = language
        })
        .then(() => model.next({ ...model.getValue() })) // HACK: refresh model to trigger a reload...
      return this.storedDefault // show the previous language while it loads
    } else {
      return language
    }
  }
}

function forWeb(entry: ?(string | { web: string })): ?string {
  return entry && typeof entry === 'object'
    ? entry.web
    : entry
}

function doLocalize(key: string, locale: string | string[]): ?string {
  return locale instanceof Array
    ? doLocalize(key, locale.join('-')) || doLocalize(key, locale[0])
    : forWeb(languages.get(locale)[key])
}

export function localize(key: string, locale: ?(string | string[])): string {
  locale = locale || model.getValue().settings.language.split('-', 1)
  Storage.store(Storage.Language, locale instanceof Array ? locale.join('-') : locale) // some locale caching
  return doLocalize(key, locale) || key
}

const PLACEHOLDER_PATTERN = '{}'
/// Template tag that localizes the given string, with placeholders filled in
export function l(strings: string[], ...args: string[]): string {
  const key = strings.join(PLACEHOLDER_PATTERN)
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
      { i % 2 ? formatter(text, (i - 1) / 2) : newlinesToReact(text) }
    </Fragment>
  )
}
