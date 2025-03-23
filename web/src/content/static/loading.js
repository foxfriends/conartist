/*       */
import * as React from 'react'
import { l } from '../../localization'
import S from './static.css'

export function Loading() {
  return (
    <section>
      <p>
        {l`Loading...`}
      </p>
    </section>
  )
}
