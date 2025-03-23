/*       */
import * as React from 'react'
import { Expand } from '../../common/animation/expand'
import { IconButton } from '../../common/icon-button'
import { Icon } from '../../common/icon'
                                                 
import S from './card.css'

                                           
              
                      
                             
                         
                     
                       
                                     
                                        
                                                                                                           
                
                                       
 


              
                     
 

export class Card                       extends React.Component                  {
  constructor(props          ) {
    super(props)
    this.state = {
      collapsed: props.defaultCollapsed || false,
    }
  }

  handleToggleCollapsed() {
    const { collapsible } = this.props
    if (typeof collapsible === 'function') {
      collapsible()
    }
    this.setState({ collapsed: !this.state.collapsed })
  }

  render() {
    const { children, collapsible, topAction, bottomAction, id, className, style, innerRef, onClick } = this.props
    const { collapsed } = this.state
    const isCollapsed = collapsed && collapsible
    const [header, content, footer] = children instanceof Array
      ? [...children]
      : [, children, ]
    return (
      <div className={`${S.card} ${className || ''}`} id={id || ''} style={style || {}} ref={innerRef} onClick={onClick || null}>
        { header
            ? <div className={S.header}>
                { header }
                { topAction ? <IconButton {...topAction} priority="tertiary" className={S.topAction} /> : null }
                { collapsible
                    ? <IconButton
                        title={collapsed ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        priority='secondary'
                        className={S.rightAction}
                        action={() => this.handleToggleCollapsed()}
                        quiet
                        />
                    : null
                }
              </div>
            : null
        }
        <div className={S.content}>
          { collapsible
            ? <>
                <Expand>
                  { !isCollapsed ? content : null }
                </Expand>
                { !isCollapsed && bottomAction ? <IconButton {...bottomAction} priority="tertiary" className={S.bottomAction} /> : null }
              </>
            : <>
                { !isCollapsed ? content : null }
                { !isCollapsed && bottomAction ? <IconButton {...bottomAction} priority="tertiary" className={S.bottomAction} /> : null }
              </>
          }
        </div>
        { footer || null }
      </div>
    )
  }
}
