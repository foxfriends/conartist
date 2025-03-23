/*       */
import * as React from 'react'

import { Icon } from '../common/icon'
import { Button } from '../common/button'
import { IconButton } from '../common/icon-button'
import { Pager } from '../common/pager'
                                                            
                                                                     
                                                          

import S from './basic.css'

                     
                
                       
                            
                        
                             
                     
                        
 

export function Basic({ title, footerTitle, onContinue, onBack, onClose, pager, children }       ) {
  const hasFooter = onContinue || footerTitle || pager || onBack;

  return (
    <div className={S.dialog}>
      { onClose ? <IconButton {...onClose} priority="tertiary" className={S.closeButton} /> : null }
      <header className={S.header}>
        { title }
      </header>
      <div className={`${S.contents} ${hasFooter ? '' : S.noFooter}`}>
        { children }
      </div>
      { hasFooter
        ? (
          <footer className={S.footer}>
            {/* backwards using row-reverse so the tab index works as expected */}
            { onContinue ? <Button className={S.footerButton} {...onContinue} key='continuebutton' /> : <Button className={S.fakeButton} title='' action={() => {}} key='fakebutton_right' /> }
            { footerTitle ? <span className={S.footerTitle}>{footerTitle}</span> : null }
            { pager
                ? <Pager {...pager} />
                : (footerTitle ? null : <span />) }
            { onBack
                ? <Button className={S.footerButton} {...onBack} key='backbutton'/>
                : (footerTitle ? null : <Button className={S.fakeButton} title='' action={() => {}} key='fakebutton_left'/>) }
          </footer>
        )
        : null
      }
    </div>
  )
}
