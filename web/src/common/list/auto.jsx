/* @flow */
import * as React from 'react'
import * as ReactX from '../../react-ext'
import { filter, map, takeUntil, tap } from 'rxjs/operators'

import { List } from './index'
import { dragStart, dragEvents } from '../../drag'
import type { Props as ItemProps } from './item'
import S from './index.css'

type Transformer<T, U> = (T, number, $Shape<ItemProps<U>>) => React.Node

export type Props<T, U> = {
  className?: string,
  style?: { [string]: string | number },
  children: Transformer<T, U> | [React.Node, Transformer<T, U>] | [React.Node, Transformer<T, U>, React.Node],
  dataSource: Iterable<T>,
  reorderable?: (U, number) => void,
}

type State<U> = {
  dragValue: U | null,
  dragIndex: number | null,
}

// $FlowIgnore
export class AutoList<T, U> extends ReactX.Component<Props<T, U>, State<U>> {
  dragIdentifier: Symbol
  // $FlowIgnore
  containerRef: React.Ref<HTMLDivElement>

  constructor(props: Props<T, U>) {
    super(props)
    this.dragIdentifier = Symbol()
    this.containerRef = React.createRef()
    this.state = {
      dragValue: null,
      dragIndex: null,
      dragPosition: null,
    }

    dragEvents
      .pipe(
        takeUntil(this.unmounted),
        tap(event => {
          const { reorderable } = this.props
          const { dragValue, dragIndex } = this.state
          if (reorderable && dragIndex !== null && dragValue !== null && !event.target) {
            reorderable(dragValue, dragIndex)
            this.setState({ dragIndex: null, dragValue: null })
          }
        }),
        filter(event => event.target === this.dragIdentifier),
        map(event => event.position),
        map(position => {
          const { current: currentRef } = this.containerRef
          if (!currentRef) { return null }
          const { dataSource } = this.props
          const [, absY] = position
          const { top } = currentRef.getBoundingClientRect()
          const relY = absY - top
          const rowHeight = 50
          return Math.min(Math.max(0, Math.round(relY / rowHeight)), [...dataSource].length)
        })
      )
      .subscribe(dragIndex => this.setState({ dragIndex }))
  }

  render() {
    const { className, style, dataSource, children, reorderable } = this.props
    const { dragIndex } = this.state
    const [ emptyState, transformer, footer ] = children instanceof Array
      ? [...children]
      : [, children, ]
    const data = [...dataSource]
    const onDragStart = reorderable
      ? ((value, index) => {
        this.setState({ dragValue: value, dragIndex: index })
        dragStart(this.dragIdentifier)
      })
      : null

    const contents = data.map((item, index) => transformer(item, index, { onDragStart }))
    if (dragIndex !== null) {
      contents.splice(dragIndex, 0, <div key='drag-indicator' className={S.dragIndicator} />)
    }

    return (
      <List className={className} style={style} containerRef={this.containerRef}>
        { data.length === 0 ? emptyState || '' : contents }
        { footer || null }
      </List>
    )
  }
}
