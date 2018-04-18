/* @flow */
import { model } from '../model'

type Direction = typeof Asc | typeof Desc
export const Asc = Symbol()
export const Desc = Symbol()

type Order<T: Object> = [$Keys<T>, Direction]
type Sorter<T> = (T, T) => number

/**
 * Creates a sort function based on the keys of an object.
 *
 * Booleans: True < False
 * Numbers: in order
 * Strings: by locale order
 * Object/Undefined: always equal
 *
 * In the case of type mismatch, boolean < number < string < object < undefined
 */
export function by<T: Object>(...orders: Order<T>[]): Sorter<T> {
  return (a, b) => {
    for (const [key, direction] of orders) {
      const dir = redirect(direction, compute(key))(a, b)
      if (dir === 0) {
        continue
      } else {
        return dir
      }
    }
    return 0
  }
}

function compute<T: Object>(key: $Keys<T>): (T, T) => number {
  return (a, b) => {
    const lhs = a[key]
    const rhs = b[key]
    if (typeof lhs !== typeof rhs) {
      return typeOrder(typeof lhs, typeof rhs)
    }
    switch (typeof lhs) {
      case 'number':
        return lhs - rhs
      case 'string':
        return lhs.localeCompare(rhs, model.getValue().settings.language, { numeric: true, ignorePunctuation: true, sensitivity: 'accent' })
      case 'boolean':
        if (lhs === rhs) {
          return 0
        }
        return lhs ? -1 : 1
      default: return 0
    }
  }
}

function typeOrder(lhs: string, rhs: string): number {
  const order = [
    'boolean',
    'number',
    'string',
    'object',
    'undefined',
  ]
  return order.indexOf(lhs) - order.indexOf(rhs)
}

function redirect<T>(direction, fn: Sorter<T>): Sorter<T> {
  return direction === Asc ? fn : (a, b) => -fn(a, b)
}
