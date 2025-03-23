/*       */
import * as React from 'react'
import { Icon } from '../../common/icon'
import { Card } from './card'
import { BasicHeader } from './basic-header'
import { BasicFooter } from './basic-footer'
const { Fragment } = React

                     
                                     
                             
                     
                      
                        
              
                     
 

export function BasicCard({ className, children, title, footer, collapsible, defaultCollapsed, id }       ) {
  return (
    <Card className={className} collapsible={collapsible || false} id={id} defaultCollapsed={defaultCollapsed || false}>
      <BasicHeader>{ title }</BasicHeader>
      <Fragment>
        { children }
      </Fragment>
      { footer ? <BasicFooter>{ footer }</BasicFooter> : null }
    </Card>
  )
}
