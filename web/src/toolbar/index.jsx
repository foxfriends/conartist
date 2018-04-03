/* @flow */
import * as React from 'react'
import { Action } from './action'
import type { Props as ActionProps } from './action'
import LOGO from '../../icons/apple-icon-180x180.png'

export type Props = {
  primary: ?ActionProps,
  secondary: ?ActionProps,
}

export function Toolbar({ primary, secondary }: Props) {
  console.log(primary, secondary)
  return (
    <div>
      <img src={LOGO} />
      <span>ConArtist</span>
      { secondary ? <Action {...secondary} /> : null }
      { primary ? <Action {...primary} /> : null }
    </div>
  )
}
