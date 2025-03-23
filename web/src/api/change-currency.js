/*       */
                                                 
import { from } from 'rxjs';
import { map, flatMap } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/user'
                                                             
             
                                           
                          
                 

export class ChangeCurrency                                                        {
  changeCurrency                                                                  

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const changeCurrency = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/update-currency.graphql')
    this.changeCurrency = changeCurrency.then(changeCurrency => new GraphQLMutation(changeCurrency.default))
  }

  send(variables                         )                                     {
    return from(this.changeCurrency)
      .pipe(
        flatMap(req => req.send(variables)),
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: response.value.updateSettings.currency }
          : response
        )
      )
  }
}
