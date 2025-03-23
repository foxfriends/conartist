/*       */
                             
             
                     
                     
 

export function empty   ()                {
  return {
    nodes: [],
    endCursor: null,
    totalNodes: 0,
  }
}

export function isFull   (connection               ) {
  return connection.nodes.length >= connection.totalNodes && !isEmpty(connection)
}

export function isEmpty   (connection               ) {
  return connection.nodes.length === 0 || connection.totalNodes === 0
}

export function extend   (old               , extension               )                {
  return {
    nodes: [...old.nodes, ...extension.nodes],
    endCursor: extension.endCursor,
    totalNodes: extension.totalNodes,
  }
}

export function prepend   (connection               , ...elements     )                {
  return {
    nodes: [...elements, ...connection.nodes],
    endCursor: connection.endCursor,
    totalNodes: connection.totalNodes + elements.length,
  }
}

export function replaceById   (connection               , element   )                {
  return {
    ...connection,
    nodes: connection.nodes.map(node => node.id === element.id ? element : node),
  }
}
