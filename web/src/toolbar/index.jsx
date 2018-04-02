/* @flow */
import * as React from 'react'
import type { Action } from './action'

export type Props = {
  primary: ?Action,
  secondary: ?Action,
}

export function Toolbar(props: Props) {
  return <div/>
}

import * as action from './action'
export { action }
