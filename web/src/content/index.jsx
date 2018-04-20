/* @flow */
import * as React from 'react'
import { CardView } from './card-view'
import { Static } from './static'
import { Products } from './products'
import { EditProducts } from './edit-products'
import { EditPrices } from './edit-prices'
import { Prices } from './prices'
import type { Props as CardViewProps } from './card-view'
import type { Props as ProductsProps } from './products'
import type { Props as EditProductsProps } from './edit-products'
import type { Props as PricesProps } from './prices'
import type { Props as EditPricesProps } from './edit-prices'
import type { Props as StaticProps } from './static'
import S from './index.css'

export type Props = { name: 'placeholder' } | EditProductsProps | ProductsProps | PricesProps | EditPricesProps | StaticProps

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
    case 'edit-products':
      content = <EditProducts {...props} />
      break
    case 'prices':
      content = <Prices {...props} />
      break
    case 'edit-prices':
      content = <EditPrices {...props} />
      break
  }
  return (
    <main className={S.container}>
      { content }
    </main>
  )
}
