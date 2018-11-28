/* @flow */
import * as React from 'react'
import { Fade } from './index'
import type { Props } from './index'
export type { Props };
import S from './secondary-card.css'

// A specialized case of the fade animation, which adjusts to a fixed container on phone sizes
export function SecondaryCardFade<E: React.ElementType>({ className, ...props }: Props<E>) {
  return (
    <Fade className={`${S.secondaryCardContainer} ${className || ''}`} {...props} />
  )
}
