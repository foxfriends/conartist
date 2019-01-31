/* @flow */
import * as React from 'react'
import S from './index.css'

export type Props = {
  content: React.Node,
  className?: ?string,
}

export function Footer({ content, className }: Props) {
  return (
    <div className={`${S.footer} ${className}`}>
      <div className={S.inner}>
        { content }
      </div>
    </div>
  )
}
