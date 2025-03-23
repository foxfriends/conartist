/*       */
import * as React from 'react'

import S from './form.css'

                     
                
                      
                        
                              
                     
 

export function Form({ image, imageWidth, children, containerClassName, className }       ) {
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
