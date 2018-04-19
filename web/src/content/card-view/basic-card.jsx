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
  id?: string,
}

export function BasicCard({ children, title, collapsible, id }: Props) {
  return (
    <Card collapsible={collapsible || false} id={id}>
      <Fragment>
        { title ? <div className={S.title}>{ title }</div> : null }
      </Fragment>
      <Fragment>
        { children }
      </Fragment>
    </Card>
  )
}
