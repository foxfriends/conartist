/*       */
import * as React from 'react'
import S from './basic-footer.css'

                     
                       
                     
 

export function BasicFooter({ children, className }       ) {
  return children ? <div className={`${S.footer} ${className || ''}`}>{ children }</div> : null
}
