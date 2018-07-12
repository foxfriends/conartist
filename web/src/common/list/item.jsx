/* @flow */
import * as React from 'react'

import { Icon } from '../../common/icon'
import S from './item.css'

export type Props<T> = {
  className?: string,
  onClick?: () => void,
  style?: { [string]: string | number },
  children?: React.Node,
  value?: T,
  onDragStart?: ?((T) => void),
}

export class Item<T> extends React.Component<Props<T>> {
  render() {
    const { className, onClick, style, children, value, onDragStart } = this.props

    return (
      <div className={`${S.item} ${onClick ? S.clickable : ''} ${className || ''}`} style={style || {}} onClick={onClick}>
        { children }
        { onDragStart && value !== undefined ? <span className={S.dragHandle} draggable onDragStart={() => onDragStart(value)}><Icon name='drag_handle' /></span> : null }
      </div>
    )
  }
}
