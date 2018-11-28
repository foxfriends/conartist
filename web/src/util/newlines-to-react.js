/* @flow */
import * as React from 'react'
const { Fragment } = React

export function newlinesToReact(text: string): React.Node {
  function insert<T>(item: React.Node, [...array]: React.Node[]): React.Node[] {
    let position = array.length
    while (position --> 1) {
      array.splice(position, 0, <Fragment key={`newline_${position}`}>{ item }</Fragment>)
    }
    return array
  }
  return insert(
    <br />,
    text
      .split('\n')
      .map((part, i) => <Fragment key={`text_${i}`}>{ part }</Fragment>)
  )
}
