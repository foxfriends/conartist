/*       */
import { Subject } from 'rxjs'
import { share } from 'rxjs/operators'
                                      

                                                                  
export const SaveProducts        = Symbol()
export const SavePrices        = Symbol()

const subject = new Subject()

export function send(event       ) {
  subject.next(event)
}

export const events                    = subject.asObservable().pipe(share())
