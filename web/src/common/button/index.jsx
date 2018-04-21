/* @flow */
import * as React from 'react'
import { localize } from '../../localization'
import S from './index.css'

export type Action = {
  title: string,
  action: () => void,
}

type Priority = 'primary' | 'secondary' | 'tertiary'

export type Props = Action & {
  priority?: Priority,
  enabled?: boolean,
  className?: string,
  style?: { [string]: string | number },
  children?: React.Node,
}

export function Button({ children, title, action, priority, enabled, className, style }: Props) {
  return (
    <button disabled={enabled === false} onClick={action} className={`${S[priority || 'primary']} ${className || ''}`} style={style || {}}>
      { children || localize(title) }
    </button>
  )
}
