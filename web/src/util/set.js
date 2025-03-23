/*       */
class ExtSet extends Set {
  union(other) {
    return new ExtSet([...this, ...other]);
  }

  intersection(other) {
    const result = new ExtSet();
    for (const item of other) {
      if (this.has(item)) {
        result.add(item);
      }
    }
    return result;
  }

  difference(other) {
    const result = new ExtSet(this);
    for (const item of other) {
      if (this.has(item)) {
        result.delete(item);
      }
    }
    return result;
  }
}

export default ExtSet;
