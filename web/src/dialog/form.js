/* @flow */
import * as React from 'react'

import S from './form.css'

export type Props = {
  image: string,
  children?: React.Node,
  className?: string,
}

export function Form({ image, imageWidth, children, className }: Props) {
  return (
    <div className={S.container}>
      <img src={image} className={S.image} width={imageWidth || 200} />
      <div className={`${S.form} ${className || ''}`}>
        <div className={S.formContent}>
          { children || null }
        </div>
      </div>
    </div>
  )
}
