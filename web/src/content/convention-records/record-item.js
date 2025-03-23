/*       */
import * as React from 'react'
import formatDate from 'date-fns/format'

import Map from '../../util/default-map'
import { l } from '../../localization'
import { Item } from '../../common/list/item'
import { Font } from '../../common/font'
import { model } from '../../model'
                                                
import S from './item.css'

                     
                 
                          
                
                                       
                      
 

function format(date      )         {
  return formatDate(date, l`h:mm`)
}

export function RecordItem({ record, convention, onClick, innerRef }       ) {
  const { products = [] } = convention || model.getValue()
  const productString =
    [...record.products.reduce((map, id) => map.set(id, map.get(id) + 1), new Map([], 0))]
      .map(([productId, count]) => [products.find(({ id }) => id === productId), count])
      .filter(([product]) => product)
      // $FlowIgnore: cannot filter
      .map(([product, count]) => `${product.name}${count > 1 ? ` (${count})` : '' }`)
      .join(', ')
  return (
    <Item onClick={onClick}>
      <div className={`${S.item} ${S.record}`} ref={innerRef}>
        <div className={S.info}>
          <div className={S.products}>{productString}</div>
          <div className={S.time}>{format(record.time)}</div>
        </div>
        <div className={S.amount}>
          {record.price.toString()}
        </div>
      </div>
    </Item>
  )
}
