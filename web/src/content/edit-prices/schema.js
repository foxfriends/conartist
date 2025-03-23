/*       */
import { VALID } from '../../model/validation'
                                              
                                                        
                                              

                                           
export const DuplicateQuantity                  = Symbol()
export const NonNumberQuantity                  = Symbol()
export const NonIntegerQuantity                  = Symbol()
export const NegativeQuantity                  = Symbol()
export const NonNumberPrice                  = Symbol()
export const NegativePrice                  = Symbol()

                             
                            
             
                                                  
                                               
                 
                     
                   
                
 

let currentPriceId = 1
export function priceId()         {
  return `price_id_${currentPriceId++}`
}

export function editablePrice(price       )                {
  // $FlowIgnore: some dirty hacks huehue
  return {
    ...price,
    original: price,
    id: priceId(),
    quantityValidation: { state: VALID },
    priceValidation: { state: VALID },
  }
}

export function nonEditablePrice(price               )        {
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

export function hasher({ typeId, productId, quantity }                       )         {
  return `${typeId}:${productId || 'any'}:${quantity}`
}
