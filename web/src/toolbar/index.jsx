/* @flow */
import * as React from 'react'
import { Action } from './action'
import type { Definition as ActionDefinition } from './action'
import LOGO from '../../icons/apple-icon-180x180.png'
import S from './index.css'

export type Props = {
  primary: ?ActionDefinition,
  secondary: ?ActionDefinition,
}

export function Toolbar({ primary, secondary }: Props) {
  return (
    <div className={S.toolbar}>
      <div className={S.inner}>
        <img src={LOGO} height="44" />
        <span className={S.title}>ConArtist</span>
        { secondary ? <Action {...secondary} priority="secondary" /> : null }
        { primary ? <Action {...primary} priority="primary" /> : null }
      </div>
    </div>
  )
}
