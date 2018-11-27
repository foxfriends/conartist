/* @flow */
export type Connection<T> = {
  nodes: T[],
  endCursor: ?string,
  totalNodes: number,
}

export function empty<T>(): Connection<T> {
  return {
    nodes: [],
    endCursor: null,
    totalNodes: 0,
  }
}

export function extend<T>(old: Connection<T>, extension: Connection<T>): Connection<T> {
  return {
    nodes: [...old.nodes, ...extension.nodes],
    endCursor: extension.endCursor,
    totalNodes: extension.totalNodes,
  }
}

export function prepend<T>(connection: Connection<T>, ...elements: [T]): Connection<T> {
  return {
    nodes: [...elements, ...connection.nodes],
    endCursor: connection.endCursor,
    totalNodes: connection.totalNodes + elements.length,
  }
}
