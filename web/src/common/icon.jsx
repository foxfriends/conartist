/* @flow */
import * as React from 'react'

import S from './icon.css'

type Props = {
  name: string,
  className?: string,
}

export function Icon({ name, className }: Props) {
  return <span className={`material-icons ${S.icon} ${className || ''}`}>{name}</span>
}
