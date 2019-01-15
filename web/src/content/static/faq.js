/* @flow */
import * as React from 'react'
import FAQ from './FAQ.md'
import S from './static.css'

export type Props = {
  className?: string,
  style?: { [string]: string | number },
}

export function Faq({ className, style }: Props) {
  return (
    <section className={className} style={style}>
      <div className={S.copy} dangerouslySetInnerHTML={{ __html: FAQ }} />
    </section>
  )
}

export default Faq
