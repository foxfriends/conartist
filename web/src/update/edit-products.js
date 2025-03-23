/*       */
import { model } from '../model'
                                                        
                                               

export function setProducts(products           ) {
  model.next({
    ...model.getValue(),
    products,
    prices: model.getValue()
      .prices
      .filter(({ productId }) => productId === null || !!products.find(product => product.id == productId))
  })
}

export function setProductTypes(productTypes               ) {
  model.next({
    ...model.getValue(),
    productTypes,
    prices: model.getValue()
      .prices
      .filter(({ typeId }) => !!productTypes.find(type => type.id === typeId))
  })
}
