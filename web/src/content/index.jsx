/* @flow */
import * as React from 'react'
import { CardView } from './card-view'
import { Static } from './static'
import type { Props as CardViewProps } from './card-view'
import type { Props as StaticProps } from './static'
import S from './index.css'

export type Props = CardViewProps | StaticProps

export function Content(props: Props) {
  let content: React.Node
  switch (props.name) {
    case 'card-view':
      content = <CardView {...props} />
      break
    case 'static':
      content = <Static {...props} />
      break
  }
  return (
    <main className={S.container}>
      { content }
    </main>
  )
}
