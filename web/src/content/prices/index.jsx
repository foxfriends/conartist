/* @flow */
import * as React from 'react'
import DefaultMap from '../../util/default-map'
import { by, Asc } from '../../util/sort'
import { l, lx } from '../../localization'
import { CardView } from '../card-view'
import { BasicCard } from '../card-view/basic-card'
import { Table } from '../table'
import { Row } from '../table/row'
import { scrollIdentifier } from '../../update/navigate'
import type { Price } from '../../model/price'
import type { Product } from '../../model/product'
import type { ProductType } from '../../model/product-type'
import S from './index.css'
const { Fragment } = React

export type Props = {
  name: 'prices',
  prices: Price[],
  products: Product[],
  productTypes: ProductType[],
}

export function Prices({ prices, products, productTypes }: Props) {
  const sortedPrices = prices
    .reduce(
      (sortedPrices, price) => sortedPrices.set(price.typeId, [...sortedPrices.get(price.typeId), price]),
      new DefaultMap([], [])
    )

  const dataSource = productTypes
    .filter(({ discontinued }) => !discontinued)
    .sort(by(['id', Asc]))
    .map(productType => [ productType, sortedPrices.get(productType.id) ])

  return (
    <CardView dataSource={dataSource}>
      <BasicCard title={l`Huh?`}>
        <div className={S.placeholder}>
          {lx`<Empty prices list message>`(x => x)}
        </div>
      </BasicCard>
      {([ productType, prices ], _) =>
        <BasicCard id={scrollIdentifier('product-type', productType.id)} title={productType.name} collapsible={true} key={`product_type_${productType.id}`}>
          <Table dataSource={prices}>
            <Fragment>
              <div className={S.placeholder}>
                {l`You haven't set any prices yet`}
                {/* TODO: get some images for this */}
              </div>
            </Fragment>
            {(price, i) => {
              const product = price.productId && products.find(({ id }) => id === price.productId)
              return <Row title={product ? product.name : <span className={S.any}>{l`Any`}</span>} value={price.quantity} detail={price.price.toString()} key={`price_${i}`} />
            }}
          </Table>
        </BasicCard>
      }
    </CardView>
  )
}
