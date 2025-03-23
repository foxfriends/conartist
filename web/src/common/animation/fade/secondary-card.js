/*       */
import * as React from 'react'
import { Fade } from './index'
                                    
                      
import S from './secondary-card.css'

// A specialized case of the fade animation, which adjusts to a fixed container on phone sizes
export function SecondaryCardFade                      ({ className, ...props }          ) {
  return (
    <Fade className={`${S.secondaryCardContainer} ${className || ''}`} {...props} />
  )
}
