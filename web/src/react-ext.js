/*       */
import * as React from "react";
import { Subject } from "rxjs";
/**
 * Adds an observable that emits when unmounted to the component to reduce the need for stored
 * subscription objects by using `takeUntil(this.unmounted)` instead
 */
export class Component extends React.Component {
  unmounted;

  constructor(props) {
    super(props);
    this.unmounted = new Subject();
  }

  componentWillUnmount() {
    this.unmounted.next();
    this.unmounted.complete();
  }
}
