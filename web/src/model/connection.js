/* @flow */
export type Connection<T> = {
  nodes: T[],
  endCursor: ?string,
  totalNodes: number,
}
