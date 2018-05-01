/* @flow */
import { Subject } from 'rxjs/Subject'
import type { Observable } from 'rxjs/Observable'
import { share } from 'rxjs/operators'

const subject: Subject<boolean> = new Subject()

export const focused: Observable<boolean> = subject.pipe(share())

export function focus() {
  subject.next(true)
}
