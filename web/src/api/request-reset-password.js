/*       */
import { of } from 'rxjs'
import { catchError } from 'rxjs/operators'
                                      

import { PostRequest } from './index'
                                       

export class RequestResetPasswordRequest extends PostRequest                             {
  constructor() {
    super('/auth/reset-password')
  }

  send(email        )                                        {
    return super.send({ email }).pipe(catchError(of))
  }
}
