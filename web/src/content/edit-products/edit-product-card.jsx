/* @flow */
import * as React from 'react'
import { l } from '../../localization'
import { Card } from '../card-view/card'
import { Input } from '../../common/input'
import { List } from '../../common/list'
import { Item } from '../../common/list/item'
import { IconButton } from '../../common/icon-button'
import { scrollIdentifier } from '../../update/navigate'
import { INVALID, VALID } from '../../model/validation'
import { DuplicateName, NonNumberQuantity, NonIntegerQuantity, NegativeQuantity } from './schema'
import type { Action } from '../../common/button'
import type { Validation } from '../../model/validation'
import type { Id, EditableProduct, EditableProductType, ValidationError } from './schema'
import type { Validation as InputValidation } from '../../common/input'
import S from './index.css'
const { Fragment } = React

function productTypeValidation(validation: Validation<ValidationError>): InputValidation {
  if (validation.state !== INVALID) {
    return validation
  }
  switch (validation.error) {
    case DuplicateName:
      return { state: INVALID, error: l`This name is used twice!` }
    default:
      return { state: VALID }
  }
}

function productNameValidation(validation: Validation<ValidationError>): InputValidation {
  if (validation.state !== INVALID) {
    return validation
  }
  switch (validation.error) {
    case DuplicateName:
      return { state: INVALID, error: l`This name is used twice!` }
    default:
      return { state: VALID }
  }
}

function productQuantityValidation(validation: Validation<ValidationError>): InputValidation {
  if (validation.state !== INVALID) {
    return validation
  }
  switch (validation.error) {
    case NonNumberQuantity:
      return { state: INVALID, error: l`This isn't a number!` }
    case NonIntegerQuantity:
      return { state: INVALID, error: l`This has to be a whole number!` }
    case NegativeQuantity:
      return { state: INVALID, error: l`You can't have less than none!` }
    default:
      return { state: VALID }
  }
}

export type Props = {
  productType: EditableProductType,
  products: EditableProduct[],
  topAction?: ?Action,
  bottomAction?: ?Action,
  onProductTypeNameChange: (string) => void,
  onProductNameChange: (Id, string) => void,
  onProductQuantityChange: (Id, string) => void,
  onProductToggleDiscontinue: (Id) => void,
}

export function EditProductCard({ productType, products, topAction, bottomAction, onProductTypeNameChange, onProductNameChange, onProductQuantityChange, onProductToggleDiscontinue }: Props) {
  return (
    <Card id={scrollIdentifier('product-type', productType.id)} collapsible={true} defaultCollapsed={productType.discontinued} topAction={topAction} bottomAction={bottomAction} className={productType.discontinued ? S.discontinued : ''}>
      <Fragment>
        <Input
          className={S.productTypeName}
          defaultValue={productType.name}
          onChange={onProductTypeNameChange}
          validation={productTypeValidation(productType.validation)}
          />
      </Fragment>
      <Fragment>
        <List dataSource={products}>
          <div className={S.placeholder}>
            {l`No products yet... add one!`}
          </div>
          {(product, _) =>
            <Item key={`product_${product.id}`} className={product.discontinued ? S.discontinued : ''}>
              <Input
                defaultValue={product.name}
                placeholder={l`New product`}
                onChange={name => onProductNameChange(product.id, name)}
                className={S.productName}
                validation={productNameValidation(product.nameValidation)}
                />
              <Input
                defaultValue={isNaN(product.quantity) ? '' : `${product.quantity}`}
                placeholder={l`Quantity`}
                onChange={quantity => onProductQuantityChange(product.id, quantity)}
                className={S.productQuantity}
                validation={productQuantityValidation(product.quantityValidation)}
                />
              <IconButton
                title={product.discontinued ? 'add_circle_outline' : 'remove_circle_outline'}
                action={() => onProductToggleDiscontinue(product.id)}
                className={S.discontinueButton}
                />
            </Item>
          }
        </List>
      </Fragment>
    </Card>
  )
}
