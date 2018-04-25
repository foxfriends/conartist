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
  className?: string,
}

export function BasicCard({ className, children, title, collapsible, defaultCollapsed, id }: Props) {
  return (
    <Card className={className} collapsible={collapsible || false} id={id} defaultCollapsed={defaultCollapsed || false}>
      <BasicHeader>{ title }</BasicHeader>
      <Fragment>
        { children }
      </Fragment>
    </Card>
  )
}
