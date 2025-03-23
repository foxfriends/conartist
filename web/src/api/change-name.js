/*       */
                                                 
import { from } from 'rxjs';
import { map, flatMap } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/user'
                                         
                                                             
             
                                   
                      
                 

export class ChangeName                                                  {
  changeName                                                          

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const changeName = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/change-name.graphql')
    this.changeName = changeName.then(changeName => new GraphQLMutation(changeName.default))
  }

  send(variables                     )                                     {
    return from(this.changeName)
      .pipe(
        flatMap(req => req.send(variables)),
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.changeUserName) }
          : response
        )
      )
  }
}
