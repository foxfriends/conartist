/* @flow */
import * as React from 'react'
import Privacy from './legal/PRIVACY.md'
import S from './static.css'

export type Props = {
  className?: string,
  style?: { [string]: string | number },
}

export function PrivacyPolicy({ className, style }: Props) {
  return (
    <section className={className} style={style}>
      <div className={S.copy} dangerouslySetInnerHTML={{ __html: Privacy }} />
    </section>
  )
}

export default PrivacyPolicy
