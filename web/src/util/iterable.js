/*       */
import Map from "./default-map";

export function separate(prop, transform) {
  const parts = new Map([], []);
  for (const item of this) {
    const key = transform ? transform(item[prop]) : item[prop];
    parts.set(key, [...parts.get(key), item]);
  }
  return parts;
}

export function dedup(toKey) {
  const contained = new Set();
  return (item) => {
    const key = toKey(item);
    if (contained.has(key)) {
      return false;
    }
    contained.add(key);
    return true;
  };
}
