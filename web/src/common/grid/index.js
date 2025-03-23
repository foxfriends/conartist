/*       */
import * as React from 'react'
import S from './index.css'

                     
                           
                                        
                     
                        
 

export function Grid({ className, style, columns, children }       ) {
  const gridLayout = {
    gridTemplateColumns: typeof columns === 'string' ? columns : '1fr '.repeat(columns).trim(),
  }

  return (
    <div className={`${S.grid} ${className || ''}`} style={{ ...gridLayout, ...style, }}>
      { children || null }
    </div>
  )
}
