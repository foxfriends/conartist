/* @flow */
import * as React from 'react'
import * as ReactDom from 'react-dom'
import { ConArtist } from './src/con-artist'

const root = document.querySelector('#root')
if (root) {
  ReactDom.render(<ConArtist />, root)
}
