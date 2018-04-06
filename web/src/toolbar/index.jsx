/* @flow */
import * as React from 'react'

import LOGO from '../../icons/apple-icon-180x180.png'
import S from './index.css'

import { Button } from '../common/button'
import type { Action } from '../common/button'

export type Props = {
  primary: ?Action,
  secondary: ?Action,
}

export function Toolbar({ primary, secondary }: Props) {
  return (
    <div className={S.toolbar}>
      <div className={S.inner}>
        <img src={LOGO} height="44" />
        <span className={S.title}>ConArtist</span>
        { secondary ? <Button {...secondary} priority="tertiary" style={{ marginRight: 20 }}/> : null }
        { primary ? <Button {...primary} priority="primary" /> : null }
      </div>
    </div>
  )
}
