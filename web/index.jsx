/* @flow */
import * as React from 'react'
import * as ReactDom from 'react-dom'
import { ConArtist } from './src/con-artist'

import './src/global.css'

const root = document.querySelector('#root')
if (root) {
  ReactDom.render(<ConArtist />, root)
}
