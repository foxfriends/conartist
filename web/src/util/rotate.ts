export function rotate<T>(arrays: T[][]): T[][] {
  return arrays[0].map((_, i) => arrays.map(_ => _[i]));
}
