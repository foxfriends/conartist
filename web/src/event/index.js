/* @flow */
import { Subject } from 'rxjs/Subject'
import { share } from 'rxjs/operators'
import type { Observable } from 'rxjs/Observable'

export opaque type Event = typeof SaveProducts
export const SaveProducts: Event = Symbol()
export const SavePrices: Event = Symbol()

const subject = new Subject()

export function send(event: Event) {
  subject.next(event)
}

export const events: Observable<Event> = subject.asObservable().pipe(share())
