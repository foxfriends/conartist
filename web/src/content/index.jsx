/* @flow */
import * as React from 'react'
import { CardView } from './card-view'
import { Static } from './static'
import { Products } from './products'
import type { Props as CardViewProps } from './card-view'
import type { Props as ProductsProps } from './products'
import type { Props as StaticProps } from './static'
import S from './index.css'

export type Props = { name: 'placeholder' } | ProductsProps | StaticProps

export function Content(props: Props) {
  let content: React.Node
  switch (props.name) {
    case 'placeholder':
      content = <div />
      break
    case 'static':
      content = <Static {...props} />
      break
    case 'products':
      content = <Products {...props} />
      break
  }
  return (
    <main className={S.container}>
      { content }
    </main>
  )
}
