/* @flow */
import * as React from 'react'
import type { Subject } from 'rxjs/Subject'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import LOGO from '../../icons/apple-icon-180x180.png'
import S from './index.css'

import { Button } from '../common/button'
import { focus as focusNavigation } from '../navigation/focus'
import type { Action, Props as ButtonProps } from '../common/button'

export type Props = {
  primary: ?(Action | ButtonProps),
  secondary: ?(Action | ButtonProps),
}

export const status: Subject<Props> = new BehaviorSubject({ primary: null, secondary: null })

export function Toolbar({ primary, secondary }: Props) {
  return (
    <div className={S.toolbar}>
      <div className={S.inner}>
        <div className={S.logoContainer} onClick={() => focusNavigation()}>
          <img src={LOGO} height={44} />
        </div>
        <span className={S.title}>ConArtist</span>
        { secondary ? <Button {...secondary} priority="tertiary" className={S.action} /> : null }
        { primary ? <Button {...primary} priority="primary" className={S.action} /> : null }
      </div>
    </div>
  )
}
