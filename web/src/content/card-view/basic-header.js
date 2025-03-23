/*       */
import * as React from 'react'
import S from './basic-header.css'

                     
                       
 

export function BasicHeader({ children }       ) {
  return children ? <div className={S.title}>{ children }</div> : null
}
