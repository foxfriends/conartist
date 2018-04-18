/* @flow */
import * as React from 'react'
import DefaultMap from '../../util/default-map'
import { l, lx } from '../../localization'
import { CardView } from '../card-view'
import { BasicCard } from '../card-view/basic-card'
import { Table } from '../table'
import { Row } from '../table/row'
import type { Product } from '../../model/product'
import type { ProductType } from '../../model/product-type'
import S from './index.css'
const { Fragment } = React

export type Props = {
  name: 'products',
  products: Product[],
  productTypes: ProductType[],
}

export function Products({ products, productTypes }: Props) {
  const sortedProducts = products
    .reduce(
      (sortedProducts, product) => sortedProducts.set(product.typeId, [...sortedProducts.get(product.typeId), product]),
      new DefaultMap([], [])
    )

  const dataSource = productTypes
    .map(productType => [ productType, sortedProducts.get(productType.id) ])

  return (
    <CardView dataSource={dataSource}>
      <BasicCard title={l`Huh?`}>
        <div className={S.placeholder}>
          {lx`<Empty products list message>`(x => x)}
        </div>
      </BasicCard>
      {([ productType, products ]) =>
        <BasicCard title={productType.name} collapsible={true} key={`product_type_${productType.id}`}>
          <Table dataSource={products}>
            <Fragment>
              <div className={S.placeholder}>
                {l`You aren't selling any of these`}
                {/* TODO: get some images for this */}
              </div>
            </Fragment>
            {product =>
              <Row title={product.name} detail={`${product.quantity}`} key={`product_${product.id}`}/>
            }
          </Table>
        </BasicCard>
      }
    </CardView>
  )
}
