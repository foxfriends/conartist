/* @flow */
import * as React from 'react'
import type { Subject } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import LOGO from '../../icons/apple-icon-180x180.png'
import S from './index.css'

import { Button } from '../common/button'
import { Icon } from '../common/icon'
import { Input } from '../common/input'
import { focus as focusNavigation } from '../navigation/focus'
import * as navigate from '../update/navigate'
import { isSignedIn } from '../util/is-signed-in'
import type { Action, Props as ButtonProps } from '../common/button'

export type TextField = {
  className: string,
  title: string,
  onChange?: (string) => void,
  onSubmit?: (string) => void,
}

export type Props = {
  primary: ?(Action | ButtonProps),
  secondary: ?(Action | ButtonProps),
  tertiary: ?(Action | ButtonProps),
  textField?: (TextField),
  pageIcon?: string,
}

export const status: Subject<$Shape<Props>> = new BehaviorSubject({ primary: null, secondary: null })

export function Toolbar({ className, primary, secondary, tertiary, textField, pageIcon }: Props) {
  return (
    <div className={`${S.toolbar} ${className}`}>
      <div className={S.inner}>
        <div className={`${S.logoContainer} ${S.desktop}`} onClick={() => isSignedIn() ? navigate.dashboard() : navigate.splash()}>
          <img className={S.logo} src={LOGO} height={44} />
          <span className={S.title}>ConArtist</span>
        </div>
        <div className={`${S.logoContainer} ${S.mobile}`} onClick={() => isSignedIn() ? focusNavigation() : navigate.splash()}>
          <img className={`${S.logo} ${pageIcon ? S.hidden : ''}`} src={LOGO} height={44} />
          { pageIcon ? <Icon className={S.pageIcon} name={pageIcon} /> : null }
        </div>
        { textField ? <Input className={S.textField} title={textField.title} onChange={textField.onChange || (() => {})} placeholder={textField.title} onSubmit={textField.onSubmit || (() => {})} /> : null }
        { tertiary ? <Button {...tertiary} priority="tertiary" className={S.action} /> : null }
        { secondary ? <Button {...secondary} priority="tertiary" className={S.action} /> : null }
        { primary ? <Button {...primary} priority="primary" className={S.action} /> : null }
      </div>
    </div>
  )
}
