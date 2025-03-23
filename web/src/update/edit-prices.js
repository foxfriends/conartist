/*       */
import { model } from '../model'
                                           

export function setPrices(prices         ) {
  model.next({
    ...model.getValue(),
    prices,
  })
}
