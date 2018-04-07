/* @flow */
import * as React from 'react'
import { Icon } from './icon'
import type { Action } from './button'

import S from './icon-button.css'

export type Props = Action & {
  enabled?: boolean,
  className?: string,
  style?: { [string]: string | number },
}

export function IconButton({ title, action, enabled, className, style }: Props) {
  return (
    <button disabled={enabled === false} onClick={action} className={`${S.button} ${className || ''}`} style={style || {}}>
      <Icon name={title} />
    </button>
  )
}
