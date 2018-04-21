/* @flow */
import * as React from 'react'
import { Icon } from '../icon'
import type { Action } from '../button'

import S from './index.css'

type Priority = 'primary' | 'secondary' | 'tertiary'

export type Props = Action & {
  priority?: Priority,
  enabled?: boolean,
  className?: string,
  style?: { [string]: string | number },
}

export function IconButton({ priority, title, action, enabled, className, style }: Props) {
  return (
    <button disabled={enabled === false} onClick={action} className={`${S.button} ${S[priority || 'primary']} ${className || ''}`} style={style || {}}>
      <Icon name={title} />
    </button>
  )
}
