/* @flow */
import DefaultMap from './default-map'
import { by, Asc } from './sort'
import { Money } from '../model/money'
import type { Product } from '../model/product'
import type { Price } from '../model/price'
import type { ProductType } from '../model/product-type'

export function calculatePrice(soldProducts: Product[], prices: Price[]): Money {
  if (prices.length <= 0) { return Money.zero }
  if (soldProducts.length <= 0) { return Money.zero }
  const matters = prices.map(price => price.productId).filter(x => x)
  let items = soldProducts
    .reduce(
      (counts, product) => {
        const id = matters.includes(product.id) ? `product-${product.id}` : `product-type-${product.typeId}`
        return counts.set(id, counts.get(id) + 1)
      },
      new DefaultMap([], 0),
    )
  return [...items].reduce(
    (price, [key, count]) => {
      const relevantPrices = prices
        .filter(price =>
          (price.productId ? `product-${price.productId}` === key : false) || `product-type-${price.typeId}` === key
        )
        .sort(by(['quantity', Asc]))
      while (count > 0) {
        const bestPrice = relevantPrices
          .reduce((best, price) => {
            if (price.quantity <= count && (!best || price.quantity > best.quantity)) {
              return price
            } else {
              return best
            }
          }, null)
        if (!bestPrice) {
          return price
        }
        count -= bestPrice.quantity
        price = price.add(bestPrice.price)
      }
      return price
    },
    Money.zero,
  )
}
