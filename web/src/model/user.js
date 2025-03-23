/*       */
                                                     
import { parse as parseSettings } from './settings'
import { parse as parseConvention } from './meta-convention'
import { parse as parseProductType } from './product-type'
import { parse as parseProduct } from './product'
import { parse as parsePrice } from './price'
                                          
                                                       
                                                 
                                        
                                    

                     
               
                
                    
                     
                              
                      
                  
                                
                    
  

export function parse({ name, email, verified, settings, productTypes = [], products = [], prices = [], conventions, clearance }                  )       {
  return {
    name,
    email,
    verified,
    settings: parseSettings(settings),
    productTypes: productTypes.map(parseProductType),
    products: products.map(parseProduct),
    prices: prices.map(parsePrice),
    conventions: conventions.map(parseConvention),
    clearance,
  }
}
