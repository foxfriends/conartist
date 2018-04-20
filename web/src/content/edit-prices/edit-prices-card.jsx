/* @flow */
import * as React from 'react'
import { l } from '../../localization'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import { Input } from '../../common/input'
import { List } from '../list'
import { Item } from '../list/item'
import { IconButton } from '../../common/icon-button'
import { scrollIdentifier } from '../../update/navigate'
import { INVALID, VALID } from '../../model/validation'
import { Money } from '../../model/money'
import { DuplicateQuantity, NonNumberQuantity, NonIntegerQuantity, NegativeQuantity, NonNumberPrice, NegativePrice } from './schema'
import type { Action } from '../../common/button'
import type { Validation } from '../../model/validation'
import type { Product } from '../../model/product'
import type { ProductType } from '../../model/product-type'
import type { EditablePrice, ValidationError } from './schema'
import type { Validation as InputValidation } from '../../common/input'
import S from './index.css'
const { Fragment } = React

function quantityValidation(validation: Validation<ValidationError>): InputValidation {
  if (validation.state !== INVALID) {
    return validation
  }
  switch (validation.error) {
    case DuplicateQuantity:
      return { state: INVALID, error: l`This quantity is set twice!` }
    case NonNumberQuantity:
      return { state: INVALID, error: l`This isn't a number!` }
    case NonIntegerQuantity:
      return { state: INVALID, error: l`This has to be a whole number!` }
    case NegativeQuantity:
      return { state: INVALID, error: l`You can't sell none!` }
    default:
      return { state: VALID }
  }
}

function priceValidation(validation: Validation<ValidationError>): InputValidation {
  if (validation.state !== INVALID) {
    return validation
  }
  switch (validation.error) {
    case NonNumberPrice:
      return { state: INVALID, error: l`This isn't a number!` }
    case NegativePrice:
      return { state: INVALID, error: l`You can charge more than that!` }
    default:
      return { state: VALID }
  }
}

export type Props = {
  productType: ProductType,
  products: Product[],
  prices: EditablePrice[],
  bottomAction?: ?Action,
  onPriceChange: (string, string) => void,
  onPriceRemove: (string) => void,
  onQuantityChange: (string, string) => void,
  onProductChange: (string, number) => void,
}

export function EditPricesCard({ productType, products, prices, bottomAction, onPriceChange, onProductChange, onQuantityChange, onPriceRemove }: Props) {
  const dataSource = prices.map(price => price.productId === null ? [price, null] : [price, products.find(product => product.id === price.productId)])
  return (
    <Card id={scrollIdentifier('product-type', productType.id)} collapsible={true} bottomAction={bottomAction}>
      <BasicHeader title={productType.name} />
      <Fragment>
        <List dataSource={dataSource}>
          <div className={S.placeholder}>
            {l`How much do these cost?`}
          </div>
          {([price, product]) =>
            <Item key={`price_${price.id}`}>
              <Input
                defaultValue={product ? product.name : 'Any'}
                placeholder={l`Product`}
                onChange={/* $FlowIgnore: TODO */
                  productId => onProductChange(price.id, productId)
                }
                className={S.productName}
                />
              <Input
                defaultValue={`${price.quantity === 0 ? '' : price.quantity}`}
                placeholder={l`How many`}
                onChange={quantity => onQuantityChange(price.id, quantity)}
                className={S.priceQuantity}
                validation={quantityValidation(price.quantityValidation)}
                />
              <Input
                defaultValue={`${!price.price || price.price.equals(Money.zero) ? '' : price.price.toString()}`}
                placeholder={l`Price`}
                onChange={priceStr => onPriceChange(price.id, priceStr)}
                className={S.pricePrice}
                validation={priceValidation(price.priceValidation)}
                />
              <IconButton
                title="remove_circle_outline"
                action={() => onPriceRemove(price.id)}
                className={S.removeButton}
                />
            </Item>
          }
        </List>
      </Fragment>
    </Card>
  )
}
