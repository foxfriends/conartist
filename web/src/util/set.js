/* @flow */
class ExtSet<V> extends Set<V> {
  union(other: Iterable<V>): ExtSet<V> {
    return new ExtSet([...this, ...other])
  }

  intersection(other: Iterable<V>): ExtSet<V> {
    const result = new ExtSet()
    for (const item of other) {
      if (this.has(item)) {
        result.add(item)
      }
    }
    return result
  }

  difference(other: Iterable<V>): ExtSet<V> {
    const result = new ExtSet(this)
    for (const item of other) {
      if (this.has(item)) {
        result.delete(item)
      }
    }
    return result
  }
}

export default ExtSet
