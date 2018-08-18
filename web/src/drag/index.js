/* @flow */
import { Subject, combineLatest, fromEvent } from 'rxjs'
import { share, map, distinctUntilChanged } from 'rxjs/operators'
import type { Observable } from 'rxjs'

export type Event = {
  target: Symbol,
  position: [number, number],
}

const target = new Subject()

const currentPosition = fromEvent(window, 'mousemove')
  .pipe(map(event => [event.clientX, event.clientY]))
fromEvent(window, 'mouseup').subscribe(dragEnd)

export const dragEvents = combineLatest(currentPosition, target.pipe(distinctUntilChanged()))
  .pipe(
    map(([position, target]) => ({ position, target })),
    share(),
  )

export function dragStart(identifier: Symbol) {
  target.next(identifier)
}

function dragEnd() {
  target.next(null)
}
