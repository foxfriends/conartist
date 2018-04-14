/* @flow */
import * as React from 'react'
import S from './item.css'
const { Fragment } = React

export type Props = {
  title?: React.Node,
  value?: React.Node,
  detail?: React.Node,
}

export function Item({ title, value, detail }: Props) {
  return (
    <Fragment>
      { title ? <div className={S.title}>{ title }</div> : <span/>}
      { value ? <div className={S.value}>{ value }</div> : <span/> }
      { detail ? <div className={S.detail}>{ detail }</div> : <span/> }
    </Fragment>
  )
}
