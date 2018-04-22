/* @flow */
import * as React from 'react'
import { CardView } from '../card-view'
import { BasicCard } from '../card-view/basic-card'

export type Props = {
  name: 'admin',
}

export function Admin(props: Props) {
  return (
    <CardView>
      <BasicCard title='Add a convention' collapsible={true} defaultCollapsed={true}>
        <div>
          Hello world
        </div>
      </BasicCard>
    </CardView>
  )
}
