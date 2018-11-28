/* @flow */
import * as React from 'react'
import { l } from '../../localization'
import S from './static.css'

export type Props = {
  className?: string,
  style?: { [string]: string | number },
}

export function Splash({ className, style }: Props) {
  return (
    <section className={`${S.container} ${className || ''}`} style={style}>
      <hgroup className={S.splashBanner}>
        <h1 className={S.headline}>{l`<Splash title>`}</h1>
        <p className={S.paragraph}>{l`<Splash body>`}</p>
      </hgroup>
    </section>
  )
}
