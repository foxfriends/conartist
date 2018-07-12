/* @flow */
import * as React from 'react'
import S from './index.css'

export type Props<T> = {
  className?: string,
  style?: { [string]: string | number },
  children?: React.Node,
  // $FlowIgnore
  containerRef?: React.Ref<HTMLDivElement>,
}

export function List<T>({ className, style, children, containerRef }: Props<T>) {
  return (
    <div className={`${S.list} ${className || ''}`} style={style || {}} ref={containerRef}>
      { children }
    </div>
  )
}
