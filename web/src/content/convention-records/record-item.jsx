/* @flow */
import * as React from 'react'
import moment from 'moment'

import Map from '../../util/default-map'
import { l } from '../../localization'
import { Item } from '../../common/list/item'
import { Font } from '../../common/font'
import { model } from '../../model'
import type { Record } from '../../model/record'
import S from './item.css'

export type Props = {
  record: Record,
}

function format(date: Date): string {
  return moment(date).format(l`h:mm`)
}

export function RecordItem({ record }: Props) {
  const { products = [] } = model.getValue()
  const productString =
    [...record.products.reduce((map, id) => map.set(id, map.get(id) + 1), new Map([], 0))]
      .map(([productId, count]) => [products.find(({ id }) => id === productId), count])
      .filter(([product]) => product)
      // $FlowIgnore: cannot filter
      .map(([product, count]) => `${product.name}${count > 1 ? ` (${count})` : '' }`)
      .join(', ')
  return (
    <Item>
      <div className={`${S.item} ${S.record}`}>
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