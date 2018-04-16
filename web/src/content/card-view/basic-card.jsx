/* @flow */
import * as React from 'react'
import { Icon } from '../../common/icon'
import { Card } from './card'
import S from './basic-card.css'
const { Fragment } = React

export type Props = { 
  collapsible?: boolean,
  title?: React.Node,
  children?: React.Node,
}

export function BasicCard({ children, title, collapsible }: Props) {
  return (
    <Card collapsible={collapsible || false}>
      <Fragment>
        { title ? <div className={S.title}>{ title }</div> : null }
      </Fragment>
      <Fragment>
        { children }
      </Fragment>
    </Card>
  )
}
