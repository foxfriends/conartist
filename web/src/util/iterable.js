/* @flow */
import Map from './default-map'

export function separate<T, K: $Keys<T>>(prop: $Keys<T>): Iterable<[$ElementType<T, K>, T[]]> {
  const parts = new Map([], [])
  for (const item of this) {
    parts.set(item[prop], [...parts.get(item[prop]), item])
  }
  return parts
}
