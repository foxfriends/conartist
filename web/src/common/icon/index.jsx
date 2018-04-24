/* @flow */
import * as React from 'react'

import S from './index.css'

type Props = {
  name: string,
  className?: string,
}

export function Icon({ name, className }: Props) {
  return (
    <span className={`${S.container} ${className || ''}`}>
      <span className='material-icons'>{name}</span>
    </span>
  )
}
