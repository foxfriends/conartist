/*       */
import { of } from 'rxjs'
import { tap } from 'rxjs/operators'
                                      

import { GetRequest } from './index'
                                                 

export class EmailInUseRequest extends GetRequest                  {
  cache                      

  constructor() {
    super('/account/exists')
    this.cache = new Map()
  }

  send(params        )                                          {
    if (this.cache.has(params)) {
      return of({ state: 'retrieved', value: !!this.cache.get(params) })
    }
    return super.send(params)
      .pipe(
        tap(response => {
          if (response.state === 'retrieved') {
            this.cache.set(params, response.value)
          }
        })
      )
  }
}
