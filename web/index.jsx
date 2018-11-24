/* @flow */
import * as React from 'react'
import * as ReactDom from 'react-dom'
import { ConArtist } from './src/con-artist'
import { to as navigateTo } from './src/update/navigate'
import { resolveRoute } from './src/routing'
import './src/global.css'

const root = document.querySelector('#root')

if (root) {
  ReactDom.render(
    <ConArtist />,
    root,
  )

  window.addEventListener('popstate', event => {
    const { state } = event
    if (state) {
      navigateTo(resolveRoute())
    }
  })
}
