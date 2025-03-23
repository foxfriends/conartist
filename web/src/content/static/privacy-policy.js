/*       */
import * as React from 'react'
import Privacy from './legal/PRIVACY.md'
import S from './static.css'

                     
                     
                                        
 

export function PrivacyPolicy({ className, style }       ) {
  return (
    <section className={className} style={style}>
      <div className={S.copy} dangerouslySetInnerHTML={{ __html: Privacy }} />
    </section>
  )
}

export default PrivacyPolicy
