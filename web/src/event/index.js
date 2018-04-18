/* @flow */
import { Subject } from 'rxjs/Subject'
import type { Observable } from 'rxjs/Observable'
import { share, tap } from 'rxjs/operators'

export type Event = typeof SaveProducts
export const SaveProducts = Symbol()

const subject = new Subject()

export function send(event: Event) {
  subject.next(event)
}

export const events: Observable<Event> = subject.asObservable().pipe(share())
