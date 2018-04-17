/* @flow */
import * as React from 'react'
import { l } from '../../localization'
import { Card } from '../card-view/card'
import { Input } from '../../common/input'
import { List } from '../list'
import { Item } from '../list/item'
import { IconButton } from '../../common/icon-button'
import type { Id, EditableProduct, EditableProductType } from './schema'
import S from './index.css'
const { Fragment } = React

export type Props = {
  productType: EditableProductType,
  products: EditableProduct[],
  onProductTypeNameChange: (string) => void,
  onProductNameChange: (Id, string) => void,
  onProductQuantityChange: (Id, string) => void,
  onProductDiscontinue: (Id) => void,
}

export function EditProductCard({ productType, products, onProductTypeNameChange, onProductNameChange, onProductQuantityChange, onProductDiscontinue }: Props) {
  return (
    <Card>
      <Fragment>
        <Input className={S.productTypeName} defaultValue={productType.name} onChange={onProductTypeNameChange} />
      </Fragment>
      <Fragment>
        <List dataSource={products}>
          <div className={S.placeholder}>
            {l`No products yet... add one!`}
          </div>
          {product =>
            <Item key={`product_${product.id}`}>
              <Input
                defaultValue={product.name}
                placeholder={l`New product`}
                onChange={name => onProductNameChange(product.id, name)}
                className={S.productName}
                />
              <Input
                defaultValue={`${product.name === '' ? '' : product.quantity}`}
                placeholder={l`Quantity`}
                onChange={quantity => onProductQuantityChange(product.id, quantity)}
                className={S.productQuantity}
                />
              <IconButton
                title={'remove_circle_outline'}
                action={() => onProductDiscontinue(product.id)}
                className={S.discontinueButton}
                />
            </Item>
          }
        </List>
      </Fragment>
    </Card>
  )
}
