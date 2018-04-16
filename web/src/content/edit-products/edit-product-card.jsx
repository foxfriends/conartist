/* @flow */
import * as React from 'react'
import { Card } from '../card-view/card'
import { Input } from '../../common/input'
import { List } from '../list'
import { Item } from '../list/item'
import type { Id, EditableProduct, EditableProductType } from './schema'
import S from './index.css'
const { Fragment } = React

export type Props = {
  productType: EditableProductType,
  products: EditableProduct[],
  onProductTypeNameChange: (string) => void,
  onProductNameChange: (Id, string) => void,
  onProductQuantityChange: (Id, string) => void,
}

export function EditProductCard({ productType, products, onProductTypeNameChange, onProductNameChange, onProductQuantityChange }: Props) {
  return (
    <Card>
      <Fragment>
        <Input className={S.productTypeName} defaultValue={productType.name} onChange={onProductTypeNameChange} />
      </Fragment>
      <Fragment>
        <List dataSource={products}>
          {product => 
            <Item>
              <Input defaultValue={product.name} onChange={name => onProductNameChange(product.id, name)} className={S.productName} />
              <Input defaultValue={`${product.quantity}`} onChange={quantity => onProductQuantityChange(product.id, quantity)} className={S.productQuantity} />
            </Item> }
        </List>
      </Fragment>
    </Card>
  )
}
