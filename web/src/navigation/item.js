/*       */
import * as React from 'react'
import { Subject } from 'rxjs'
import { share } from 'rxjs/operators'
                                      

import { focus } from './focus'
import { Icon } from '../common/icon'
import { send } from '../event'
import { AutoList as List } from '../common/list/auto'
import { Item as ListItem } from '../common/list/item'
import { Expand } from '../common/animation/expand'
import { localize } from '../localization'
import S from './item.css'

                                  
                                    
export const DIRECT         = Symbol('Direct')
export const INDIRECT           = Symbol('Indirect')

const reorderedSubject = new Subject()
export const reordered                               = reorderedSubject.asObservable().pipe(share())

export class ItemInfo {
  title        
  icon        
  children             
  selected                      
  enabled         
  isReorderable         
  action            

  constructor(title        , icon        , action            ) {
    this.title = title
    this.icon = icon
    this.children = null
    this.selected = null
    this.enabled = true
    this.isReorderable = false
    this.action = action
  }

  /**
   * Selects or deselects this item
   *
   * @param {boolean} selected Whether the item should be selected
   * @returns {this}
   */
  select(selected         , directness                    = DIRECT)           {
    this.selected = selected ? directness : null
    if (this.children) {
      this.children = this.children.map(child => child.select(selected, directness))
    }
    return this
  }

  /**
   * Sets the children of this item
   *
   * @param children {?ItemInfo[]} The children to set
   * @returns {this}
   */
  withChildren(children             )           {
    this.children = children
    return this
  }

  /**
   * Enables or disables this item
   *
   * @param {boolean} enabled Whether the item should be enabled
   * @returns {this}
   */
  enable(enabled         , nested          = false)           {
    this.enabled = enabled
    if (nested && this.children) {
      this.children = this.children.map(child => child.enable(enabled))
    }
    return this
  }

  /**
   * Sets this item to be reorderable
   *
   * @returns {this}
   */
  reorderable() {
    this.isReorderable = true
    return this
  }
}

                                
                 
 

              
                  
 

const DEPTH_INDENT = 34

export class Item extends React.Component               {
  static getDerivedStateFromProps(props       , { order = [] }       )        {
    const children = props.children || [];
    const isReorderable = (children || []).some(child => child.isReorderable)
    if (!isReorderable) {
      return { order: children.map((_, i) => i) }
    }
    if (children.length < order.length) {
      return {
        order: order.filter(i => i < children.length)
      }
    } else if (children.length > order.length) {
      return {
        order: children.map((_, i) => order[i] || i),
      }
    }
    return null
  }

  constructor(props       ) {
    super(props)
    this.state = {
      order: (props.children || []).map((_, i) => i),
    }
  }

  onNavigationListReordered(value        , index        ) {
    reorderedSubject.next([value, index])
    if (value < index) {
      index -= 1
    }
    const { order: [...order] } = this.state
    const [removed] = order.splice(value, 1)
    order.splice(index, 0, removed)
    this.setState({ order })
  }

  render() {
    const { title, action, icon, depth = 0, selected, enabled, children, value } = this.props
    const { order } = this.state
    let indicator = S.indicatorDefault
    if (selected === DIRECT) {
      indicator = S.indicatorSelected
    } else if (selected === INDIRECT) {
      indicator = S.indicatorDeep
    }

    const onClick = () => {
      focus()
      if (enabled) {
        action()
      }
    }

    const isReorderable = (children || []).some(child => child.isReorderable)

    const orderedChildren = isReorderable
      ? children.map((_, i) => i)
        .map(i => order[i] === undefined ? i : order[i])
        .map(i => children[i])
      : (children || [])

    return (
      <div className={S.container} onClick={onClick}>
        <div className={`${S.item}  ${enabled ? '' : S.disabled}`}>
          <div className={`${S.indicator} ${indicator}`} />
          <div className={S.indent} style={{ width: depth * DEPTH_INDENT}} />
          <Icon name={icon} className={S.icon} />
          <span className={S.title}>{ localize(title) }</span>
        </div>
        {/* $FlowIgnore: maybe I typed it wrong? but looks like Flow is just dumb */}
        <Expand className={S.children}>
          <List dataSource={orderedChildren} reorderable={isReorderable ? (...args) => this.onNavigationListReordered(...args) : null}>
            { (child, key, extraProps) =>
                <ListItem key={`child_${key}`} {...extraProps} reorderable={isReorderable}>
                  {/* $FlowIgnore: apparently can't tell that ItemInfo is Props */}
                  <Item {...child} depth={depth + 1}/>
                </ListItem>
            }
          </List>
        </Expand>
      </div>
    )
  }
}
