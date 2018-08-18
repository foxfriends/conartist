/* @flow */
import { Subject } from 'rxjs'
import { share } from 'rxjs/operators'
import type { Observable } from 'rxjs'

export opaque type Event = typeof SaveProducts | typeof SavePrices
export const SaveProducts: Event = Symbol()
export const SavePrices: Event = Symbol()

const subject = new Subject()

export function send(event: Event) {
  subject.next(event)
}

export const events: Observable<Event> = subject.asObservable().pipe(share())
