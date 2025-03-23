/*       */
                                                 
import { from } from 'rxjs';
import { map, flatMap } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/user'
                                         
                                                             
             
                                     
                       
                 

export class ChangeEmail                                                   {
  changeEmail                                                            

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const changeEmail = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/change-email.graphql')
    this.changeEmail = changeEmail.then(changeEmail => new GraphQLMutation(changeEmail.default))
  }

  send(variables                      )                                     {
    return from(this.changeEmail)
      .pipe(
        flatMap(req => req.send(variables)),
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.changeUserEmail) }
          : response
        )
      )
  }
}
