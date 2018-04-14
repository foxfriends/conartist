/* @flow */
export default class DefaultMap<K, V> extends Map<K, V> {
  default: V

  constructor(init: Iterable<[K, V]>, def: V) {
    super(init)
    this.default = def
  }

  get(key: K): V {
    return super.get(key) || this.default
  }

  set(key: K, value: V): self {
    return super.set(key, value)
  }
}
