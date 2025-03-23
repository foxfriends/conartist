/*       */
import * as React from 'react'
import Terms from './legal/TERMS.md'
import S from './static.css'

                     
                     
                                        
 

export function TermsOfService({ className, style }       ) {
  return (
    <section className={className} style={style}>
      <div className={S.copy} dangerouslySetInnerHTML={{ __html: Terms }} />
    </section>
  )
}

export default TermsOfService
