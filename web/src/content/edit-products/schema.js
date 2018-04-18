/* @flow */
import type { ProductType } from '../../model/product-type'
import type { Product } from '../../model/product'

export type EditableProductType = {
  productType?: ?EditableProductType,
  id: Id,
  name: string,
  color: ?number,
  discontinued: boolean,
}

export type EditableProduct = {
  product?: ?EditableProduct,
  id: Id,
  typeId: Id,
  name: string,
  quantity: number,
  discontinued: boolean,
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

export function nonEditableProduct(product: EditableProduct): Product {
  if (typeof product.id === 'string' || typeof product.typeId === 'string') {
    throw new Error('Cannot convert an unsaved product to a Product');
  }
  return {
    id: product.id,
    typeId: product.typeId,
    name: product.name,
    quantity: product.quantity,
    discontinued: product.discontinued,
  }
}

export function nonEditableProductType(productType: EditableProductType): ProductType {
  if (typeof productType.id === 'string') {
    throw new Error('Cannot convert an unsaved product type to a ProductType');
  }
  return {
    id: productType.id,
    name: productType.name,
    color: productType.color,
    discontinued: productType.discontinued,
  }
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
