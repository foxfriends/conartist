/*       */
import * as React from 'react'
import DefaultMap from '../../util/default-map'
import { by, Asc, Desc } from '../../util/sort'
import { l, lx } from '../../localization'
import { AutoCardView as CardView } from '../card-view/auto'
import { BasicCard } from '../card-view/basic-card'
import { Card } from '../card-view/card'
import { AutoTable as Table } from '../../common/table/auto'
import { Row } from '../../common/table/row'
import { scrollIdentifier } from '../../update/navigate'
                                              
                                                  
                                                           
import S from './index.css'
const { Fragment } = React

                     
                 
                  
                      
                              
 

export function Prices({ prices, products, productTypes }       ) {
  const sortedPrices = [...prices]
    .sort(by(['typeId', Asc], ['productId', Asc, Desc], ['quantity', Asc]))
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
      <Card className={S.emptyState}>
        <div className={S.placeholder}>
          {lx`<Empty prices list message>`(x => x)}
        </div>
      </Card>
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
