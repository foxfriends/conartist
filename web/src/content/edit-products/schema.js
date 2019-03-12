/* @flow */
import { VALID } from '../../model/validation'
import type { ProductType } from '../../model/product-type'
import type { Product } from '../../model/product'
import type { Validation } from '../../model/validation'
import Map from '../../util/default-map'

export opaque type ValidationError = Symbol
export const DuplicateName: ValidationError = Symbol()
export const NonNumberQuantity: ValidationError = Symbol()
export const NegativeQuantity: ValidationError = Symbol()
export const NonIntegerQuantity: ValidationError = Symbol()

export type EditableProductType = {
  productType?: ?EditableProductType,
  validation: Validation<ValidationError>,
  id: Id,
  name: string,
  color: ?number,
  sort: number,
  discontinued: boolean,
  deleted: boolean,
}

export type EditableProduct = {
  product?: ?EditableProduct,
  nameValidation: Validation<ValidationError>,
  quantityValidation: Validation<ValidationError>,
  id: Id,
  typeId: Id,
  name: string,
  quantity: number,
  sort: number,
  discontinued: boolean,
  deleted: boolean,
}

export type Id = number | string

let typeIdCounter = 0
export function uniqueTypeId(): Id {
  return `product_type_id_${typeIdCounter++}`
}

let productIdCounter = 0
export function uniqueProductId(): Id {
  return `product_id_${productIdCounter++}`
}

export function peekTypeId(): Id {
  return `product_type_id_${typeIdCounter}`
}

export function editableProduct() {
  const sort = new Map([], 0)
  return (product: Product): EditableProduct => {
    const index = sort.get(product.typeId)
    sort.set(product.typeId, index + 1)
    // $FlowIgnore: some dirty hacks huehue
    return {
      ...product,
      product,
      sort: index,
      deleted: false,
      nameValidation: { state: VALID },
      quantityValidation: { state: VALID },
    }
  }
}

export function editableProductType(productType: ProductType, index: number): EditableProductType {
  // $FlowIgnore: some dirty hacks huehue
  return {
    ...productType,
    productType,
    sort: index,
    deleted: false,
    validation: { state: VALID },
  }
}

export function nonEditableProduct({ id, sort, typeId, name, quantity, discontinued }: EditableProduct): Product {
  if (isNaN(quantity)) {
    throw new Error('Cannot make a Product with an invalid quantity')
  }
  if (typeof id === 'string' || typeof typeId === 'string') {
    throw new Error('Cannot convert an unsaved product to a Product');
  }
  return { id, sort, typeId, name, quantity, discontinued }
}

export function nonEditableProductType({ id, sort, name, color, discontinued }: EditableProductType): ProductType {
  if (typeof id === 'string') {
    throw new Error('Cannot convert an unsaved product type to a ProductType');
  }
  return { id, sort, name, color, discontinued }
}

export function setProductTypeIds(products: EditableProduct[], productTypes: EditableProductType[]): EditableProduct[] {
  return products
    .map(product => {
      if (typeof product.typeId === 'number') {
        // product was of an existing type, so type information won't need updating
        return product
      } else {
        // product is of a new type, so replace its typeId with the retrieved value
        const productType = productTypes.find(({ productType }) => productType && productType.id === product.typeId)
        if (productType) {
          return { ...product, typeId: productType.id }
        }
      }
      return product
    })
}

export function hasher({ typeId, name }: EditableProduct): string {
  return `${typeId}:${name}`
}
