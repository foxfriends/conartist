/*       */
import * as React from 'react'
import S from './index.css'

                        
                     
                                        
                        
                
                                           
 

export function List   ({ className, style, children, containerRef }          ) {
  return (
    <div className={`${S.list} ${className || ''}`} style={style || {}} ref={containerRef}>
      { children }
    </div>
  )
}
