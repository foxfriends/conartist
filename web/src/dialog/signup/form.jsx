/* @flow */
import * as React from 'react'

import S from './form.css'

export type Props = {
  image: string,
  children?: React.Node,
}

export function Form({ image, children }: Props) {
  return (
    <div className={S.container}>
      <img src={image} className={S.image} />
      <div className={S.form}>
        <div className={S.formContent}>
          { children || null }
        </div>
      </div>
    </div>
  )
}
