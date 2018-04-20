/* @flow */
import { VALID } from '../../model/validation'
import type { Price } from '../../model/price'
import type { Validation } from '../../model/validation'
import type { Money } from '../../model/money'

export opaque type ValidationError = Symbol
export const DuplicateQuantity: ValidationError = Symbol()
export const NonNumberQuantity: ValidationError = Symbol()
export const NonIntegerQuantity: ValidationError = Symbol()
export const NegativeQuantity: ValidationError = Symbol()
export const NonNumberPrice: ValidationError = Symbol()
export const NegativePrice: ValidationError = Symbol()

export type EditablePrice = {
  original?: ?EditablePrice,
  id: string,
  quantityValidation: Validation<ValidationError>,
  priceValidation: Validation<ValidationError>,
  typeId: number,
  productId: ?number,
  quantity: number,
  price: ?Money,
}

let currentPriceId = 1
export function priceId(): string {
  return `price_id_${currentPriceId++}`
}

export function editablePrice(price: Price): EditablePrice {
  // $FlowIgnore: some dirty hacks huehue
  return {
    ...price,
    original: price,
    quantityValidation: { state: VALID },
    priceValidation: { state: VALID },
  }
}

export function nonEditablePrice(price: EditablePrice): Price {
  if (isNaN(price.quantity)) {
    throw new Error('Cannot make a Price with an invalid quantity')
  }
  if (!price.price) {
    throw new Error('Cannot make a Price with an invalid price property')
  }
  return {
    typeId: price.typeId,
    productId: price.productId,
    quantity: price.quantity,
    price: price.price,
  }
}
