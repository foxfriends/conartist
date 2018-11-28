/* @flow */
import * as React from 'react'

import { Icon } from '../../common/icon'
import S from './item.css'

export type Props = {
  className?: string,
  onClick?: () => void,
  style?: { [string]: string | number },
  children?: React.Node,
  index?: number,
  reorderable?: ?boolean,
  onDragStart?: ?((number) => void),
}

export class Item extends React.Component<Props> {
  render() {
    const { className, onClick, style, children, index, onDragStart, reorderable } = this.props

    return (
      <div className={`${S.item} ${onClick ? S.clickable : ''} ${className || ''}`} style={style || {}} onClick={onClick}>
        { children }
        { onDragStart && index !== undefined && reorderable ? <span className={S.dragHandle} draggable onDragStart={() => onDragStart(index)}><Icon name='drag_handle' /></span> : null }
      </div>
    )
  }
}
