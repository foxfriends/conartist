/* @flow */
import * as React from 'react'

import S from './form.css'

export type Props = {
  image: string,
  imageWidth?: number,
  children?: React.Node,
  containerClassName?: string,
  className?: string,
}

export function Form({ image, imageWidth, children, containerClassName, className }: Props) {
  return (
    <div className={`${S.container} ${containerClassName}`}>
      <img src={image} className={S.image} width={imageWidth || 200} />
      <div className={`${S.form} ${className || ''}`}>
        <div className={S.formContent}>
          { children || null }
        </div>
      </div>
    </div>
  )
}
