/* @flow */
import * as React from 'react'
import { Icon } from '../../common/icon'
import { Card } from './card'
import { BasicHeader } from './basic-header'
const { Fragment } = React

export type Props = {
  collapsible?: boolean,
  defaultCollapsed?: boolean,
  title?: React.Node,
  children?: React.Node,
  id?: string,
}

export function BasicCard({ children, title, collapsible, defaultCollapsed, id }: Props) {
  return (
    <Card collapsible={collapsible || false} id={id} defaultCollapsed={defaultCollapsed || false}>
      <BasicHeader title={title} />
      <Fragment>
        { children }
      </Fragment>
    </Card>
  )
}
