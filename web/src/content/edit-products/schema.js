/*       */
import { VALID } from '../../model/validation'
                                                           
                                                  
                                                        
import Map from '../../util/default-map'

                                           
export const DuplicateName                  = Symbol()
export const DuplicateSku                  = Symbol()
export const NonNumberQuantity                  = Symbol()
export const NegativeQuantity                  = Symbol()
export const NonIntegerQuantity                  = Symbol()

                                   
                                     
                                          
         
               
               
                 
               
                        
                   
 

                               
                             
                                              
                                             
                                                  
         
             
               
               
                   
               
                        
                   
 

                                

let typeIdCounter = 0
export function uniqueTypeId()     {
  return `product_type_id_${typeIdCounter++}`
}

let productIdCounter = 0
export function uniqueProductId()     {
  return `product_id_${productIdCounter++}`
}

export function peekTypeId()     {
  return `product_type_id_${typeIdCounter}`
}

export function editableProduct() {
  const sort = new Map([], 0)
  return (product         )                  => {
    const index = sort.get(product.typeId)
    sort.set(product.typeId, index + 1)
    // $FlowIgnore: some dirty hacks huehue
    return {
      ...product,
      product,
      sort: index,
      deleted: false,
      nameValidation: { state: VALID },
      skuValidation: { state: VALID },
      quantityValidation: { state: VALID },
    }
  }
}

export function editableProductType(productType             , index        )                      {
  // $FlowIgnore: some dirty hacks huehue
  return {
    ...productType,
    productType,
    sort: index,
    deleted: false,
    validation: { state: VALID },
  }
}

export function nonEditableProduct({ id, sort, typeId, name, sku, quantity, discontinued }                 )          {
  if (isNaN(quantity)) {
    throw new Error('Cannot make a Product with an invalid quantity')
  }
  if (typeof id === 'string' || typeof typeId === 'string') {
    throw new Error('Cannot convert an unsaved product to a Product');
  }
  return { id, sort, typeId, name, sku, quantity, discontinued }
}

export function nonEditableProductType({ id, sort, name, color, discontinued }                     )              {
  if (typeof id === 'string') {
    throw new Error('Cannot convert an unsaved product type to a ProductType');
  }
  return { id, sort, name, color, discontinued }
}

export function setProductTypeIds(products                   , productTypes                       )                    {
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

export function hasher({ typeId, name }                 )         {
  return `${typeId}:${name.trim()}`
}
