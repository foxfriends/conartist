/* @flow */
import * as React from 'react'
import { localize } from '../localization'
import S from './button.css'

export type Action = {
  title: string,
  action: () => void,
  className?: string,
  style?: { [string]: string }
}

type Priority = 'primary' | 'secondary' | 'tertiary'

export type Props = Action & {
  priority: Priority,
  enabled?: boolean,
}

export function Button({ title, action, priority, enabled, className, style }: Props) {
  return (
    <button disabled={enabled === false} onClick={action} className={`${S[priority]} ${className || ''}`} style={style || {}}>
      {localize(title)}
    </button>
  )
}
