/*       */
                                      
import { of } from 'rxjs'
import { tap, switchMap, catchError } from 'rxjs/operators'

import { PostRequest } from './index'
import { Storage } from '../storage'
                                       

                
              
              
  

export class ChangePasswordRequest extends PostRequest                  {
  constructor() {
    super('/auth/change-password')
  }
}
