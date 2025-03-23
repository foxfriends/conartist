/*       */
                                                 
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
                                                             
             
                                                 
                             
                 

// $FlowIgnore: trouble importing graphql files
import addConventionInfo from './graphql/mutation/add-convention-info.graphql'

// Admin use only, for adding convention extra info
export class AddConventionInfo                                                         {
  addConventionInfo                                                                        

  constructor() {
    this.addConventionInfo = new GraphQLMutation(addConventionInfo)
  }

  send(variables                            )                                     {
    return this.addConventionInfo.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: null }
          : response
        )
      )
  }
}
