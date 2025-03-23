/*       */
                                      
import { of } from 'rxjs'
import { tap, switchMap, catchError } from 'rxjs/operators'

import { PostRequest } from './index'
import { Storage } from '../storage'
                                       
                                         
import { UserQuery } from './user-query'

                
              
              
  

export class SignInRequest extends PostRequest               {
  constructor(staySignedIn         ) {
    super('/auth')
    this.staySignedIn = staySignedIn
  }

  send(params        )                                     {
    return super.send(params)
      .pipe(
        tap(response => {
          if (response.state === 'retrieved') {
            if (this.staySignedIn) {
              Storage.store(Storage.Auth, response.value)
            } else {
              Storage.storeTemp(Storage.Auth, response.value)
            }
          } else if (response.state === 'failed') {
            Storage.remove(Storage.Auth)
            throw response
          }
        }),
        switchMap(response => response.state === 'retrieved'
          ? new UserQuery().send()
          : of(response)
        ),
        catchError(error => of(error)),
      )
  }
}
