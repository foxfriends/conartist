/* @flow */
import * as React from 'react'
import DefaultMap from '../../util/default-map'
import { l, lx } from '../../localization'
import { CardView } from '../card-view'
import { Card } from '../card-view/card'
import { List } from '../list'
import { Item } from '../list/item'
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
  const sortedProducts: Map<ProductType, Product[]> = new Map(
    [...products
      .reduce(
        (sortedProducts, product) => sortedProducts.set(product.typeId, [...sortedProducts.get(product.typeId), product]),
        new DefaultMap([], [])
      )
    ]
    // $FlowIgnore: Not good enough to filter undefined out, so doing this hack instead
    .map(([typeId, products]) => [(productTypes.find(productType => productType.id === typeId): ProductType), products])
  )

  return (
    <CardView dataSource={sortedProducts}>
      <Fragment>
        <Card title={l`Huh?`}>
          <div className={S.placeholder}>
            {lx`<Empty products list message>`(x => x)}
          </div>
        </Card>
      </Fragment>
      {([ productType, products ]) =>
        <Card title={productType.name} collapsible={true} key={`product_type_${productType.id}`}>
          <List dataSource={products}>
            <Fragment>
              <div className={S.placeholder}>
                {l`You don't have any of these yet!`}
                {/* TODO: get some images for this */}
              </div>
            </Fragment>
            {product =>
              <Item title={product.name} detail={`${product.quantity}`} key={`product_${product.id}`}/>
            }
          </List>
        </Card>
      }
    </CardView>
  )
}
