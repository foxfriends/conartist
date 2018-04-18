/* @flow */
import * as React from 'react'
import { Subject } from 'rxjs/Subject'
/**
 * Adds an observable that emits when unmounted to the component to reduce the need for stored
 * subscription objects by using `takeUntil(this.unmounted)` instead
 */
export class Component<Props, State> extends React.Component<Props, State> {
  unmounted: Subject<void>

  constructor(props: Props) {
    super(props)
    this.unmounted = new Subject()
  }

  componentWillUnmount() {
    this.unmounted.next()
  }
}
