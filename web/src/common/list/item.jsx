/* @flow */
import * as React from 'react'
import S from './item.css'

export type Props<T> = {
  className?: string,
  onClick?: () => void,
  style?: { [string]: string | number },
  children?: React.Node,
  value?: T,
}

export class Item<T> extends React.Component<Props<T>> {
  render() {
    const { className, onClick, style, children, value } = this.props

    React.Children.map(children, child => {
      console.log(child)
    })

    return (
      <div className={`${S.item} ${onClick ? S.clickable : ''} ${className || ''}`} style={style || {}} onClick={onClick}>
        { children }
      </div>
    )
  }
}
