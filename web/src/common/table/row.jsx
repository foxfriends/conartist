/* @flow */
import * as React from 'react'
import S from './row.css'
const { Fragment } = React

export type Props = {
  title?: React.Node,
  value?: React.Node,
  detail?: React.Node,
  tall: boolean,
}

export function Row({ tall, title, value, detail }: Props) {
  return (
    <Fragment>
      { title ? <div className={`${S.title}`}>{ title }</div> : <span/>}
      { value ? <div className={`${tall ? S.tall : ''} ${S.value} ${detail ? '' : S.valueDetail}`}>{ value }</div> : <span/> }
      { detail ? <div className={`${S.detail}`}>{ detail }</div> : null }
      { tall ? <span/> : null}
    </Fragment>
  )
}
